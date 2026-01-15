const express=require('express');
const app=express();
const path=require('path');
const { User, Note } = require('./model/users');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const JWT_SECRET = 'your_secret_key_change_this';

// Google OAuth Credentials - Load from environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(cookieParser());

// Session middleware
app.use(session({
  secret: 'your_session_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

// Configure Google Strategy
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google profile:', profile);
      
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        return done(null, user);
      }
      
      // Create new user from Google profile
      const newUser = new User({
        username: profile.displayName,
        email: profile.emails[0].value,
        password: 'google-oauth-user' // Placeholder for OAuth users
      });
      
      await newUser.save();
      return done(null, newUser);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Middleware to prevent caching for authenticated pages
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// Middleware to verify authentication
const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/login');
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    console.log('Authenticated user ID:', req.userId); // Debug log
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.clearCookie('token');
    return res.redirect('/login');
  }
};

// Login route - GET
app.get("/login", (req, res) => {
  // Clear any existing token cookie
  res.clearCookie('token');
  res.render("login", { error: '' });
});

// Login route - POST
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.render("login", { error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.render("login", { error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.render("login", { error: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/');
  } catch (err) {
    console.error('Login error:', err);
    res.render("login", { error: 'An error occurred. Please try again.' });
  }
});

// Register route - GET
app.get("/register", (req, res) => {
  res.render("register", { error: '' });
});

// Register route - POST
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.render("register", { error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.render("register", { error: 'Email or username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.error('Registration error:', err);
    res.render("register", { error: 'An error occurred. Please try again.' });
  }
});

// Logout route
app.get("/logout", (req, res) => {
  res.clearCookie('token');
  // Force redirect to login with cache busting
  res.redirect('/login?logout=1');
});

// Protected route - Home page
app.get('/', isAuthenticated, async (req, res) => {
  try {
    const searchTerm = (req.query.q || '').trim().toLowerCase();
    
    console.log('Fetching notes for user:', req.userId); // Debug log
    
    // Get notes for the logged-in user
    let query = { userId: req.userId };
    let notes = await Note.find(query).sort({ createdAt: -1 });
    
    console.log(`Found ${notes.length} notes for user ${req.userId}`); // Debug log
    
    // Filter notes if search term is provided
    if (searchTerm) {
      notes = notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm) || 
        note.content.toLowerCase().includes(searchTerm)
      );
    }
    
    // Format notes for display
    const files = notes.map(note => ({
      name: note.title,
      id: note._id.toString(),
      mtime: note.createdAt,
      timeAgo: getTimeAgo(note.createdAt),
      summary: getSummary(note.content),
      content: note.content
    }));
    
    res.render('index', { files, searchTerm });
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.render('index', { files: [], searchTerm: '' });
  }
});

// Helper function to calculate relative time
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

function getSummary(content) {
  const normalized = content.replace(/\s+/g, ' ').trim();
  if (!normalized) return 'Empty note.';
  const limit = 160;
  return normalized.length > limit ? `${normalized.slice(0, limit)}…` : normalized;
}

app.post("/create", isAuthenticated, async (req, res) => {
  try {
    const { title, details } = req.body;

    if (!title || !details) {
      return res.redirect("/");
    }

    console.log('Creating note for user:', req.userId); // Debug log

    const newNote = new Note({
      title: title,
      content: details,
      userId: req.userId
    });

    await newNote.save();
    console.log('Note created successfully with ID:', newNote._id); // Debug log
    res.redirect("/");
  } catch (err) {
    console.error('Error creating note:', err);
    res.redirect("/");
  }
});

app.post("/delete/:filename", isAuthenticated, async (req, res) => {
  try {
    const noteId = req.params.filename;
    
    // Delete note only if it belongs to the logged-in user
    const result = await Note.findOneAndDelete({
      _id: noteId,
      userId: req.userId
    });
    
    if (!result) {
      console.error('Note not found or unauthorized');
    }
    res.redirect("/");
  } catch (err) {
    console.error('Error deleting note:', err);
    res.redirect("/");
  }
});


// About route (protected)
app.get('/about', isAuthenticated, (req, res) => {
  res.render('about');
});

// Google OAuth Routes
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      // Create JWT token for the authenticated user
      const token = jwt.sign({ id: req.user._id, email: req.user.email }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('token', token, { httpOnly: true });
      res.redirect('/');
    } catch (err) {
      console.error('Google callback error:', err);
      res.redirect('/login');
    }
  }
);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
