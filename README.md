# 📝 Notes App - Full Stack Application

A secure, user-authenticated notes application built with Node.js, Express, MongoDB, and JWT authentication. Features include user registration/login, Google OAuth integration, and user-specific note management.

## ✨ Features

- 🔐 **User Authentication**
  - Email/Password registration and login
  - Google OAuth 2.0 integration
  - JWT-based session management
  - Secure password hashing with bcrypt

- 📝 **Notes Management**
  - Create, read, search, and delete notes
  - User-specific notes (isolated per account)
  - Real-time note timestamps
  - Search functionality

- 🎨 **User Interface**
  - Modern, responsive design
  - Form auto-clear on page load
  - Professional styling with CSS
  - Background images on auth pages

- 🛡️ **Security**
  - Password hashing with bcrypt
  - httpOnly cookies (XSS protection)
  - Authentication middleware
  - Logout functionality
  - Cache control headers

## 🚀 Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose ODM)
- Passport.js (Google OAuth)
- JWT (JSON Web Tokens)
- bcrypt (Password hashing)

**Frontend:**
- EJS (Templating)
- CSS3
- JavaScript (Vanilla)

## 📋 Prerequisites

- Node.js (v14+)
- MongoDB (running locally or connection string)
- Google OAuth credentials (for Google login)

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```
JWT_SECRET=your_secret_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MONGODB_URI=mongodb://localhost/mydatabase
SESSION_SECRET=your_session_secret
PORT=3000
```

### 4. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web Application)
5. Add authorized redirect URI: `http://localhost:3000/auth/google/callback`
6. Copy Client ID and Secret to `.env`

### 5. Start MongoDB
```bash
# Make sure MongoDB is running
mongod
```

### 6. Run the server
```bash
node index.js
```

Server runs at: `http://localhost:3000`

## 📖 Usage

### Register a New Account
1. Visit http://localhost:3000/login
2. Click "Register here" link
3. Enter username, email, password
4. Account created!

### Login
- Email/Password login
- Or click "Sign in with Google"

### Create Notes
1. After login, type title and content
2. Click "Add Note" button
3. Notes appear in the list

### Delete Notes
- Click trash icon (🗑️) on any note
- Confirm deletion

### Logout
- Click "Logout" button in header
- Redirected to login page

## 📁 Project Structure

```
backend/
├── index.js                 # Main server file
├── model/
│   └── users.js            # User & Note schemas
├── views/
│   ├── login.ejs           # Login page
│   ├── register.ejs        # Register page
│   ├── index.ejs           # Notes page
│   └── about.ejs           # About page
├── public/
│   ├── stylesheets/
│   │   └── style.css       # Main styles
│   └── images/             # App images
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
└── package.json            # Dependencies
```

## 🔐 Security Features

- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ JWT tokens stored in httpOnly cookies (XSS protection)
- ✅ Authentication middleware on protected routes
- ✅ User-specific note isolation in database
- ✅ Cache control headers prevent data leaking
- ✅ CSRF protection ready
- ✅ Input validation on all forms

## 🐛 Troubleshooting

### "MongoDB connection error"
- Make sure MongoDB is running: `mongod`
- Check MONGODB_URI in `.env`

### "The OAuth client was not found"
- Verify Google Client ID is correct
- Check redirect URI matches Google Console settings
- Ensure credentials are in `.env`

### "Cannot find module"
- Run `npm install` again
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Notes not appearing
- Check MongoDB is running
- Verify you're logged in
- Check browser console for errors

## 📝 API Routes

### Authentication
- `GET /login` - Login page
- `POST /login` - Login submission
- `GET /register` - Register page
- `POST /register` - Register submission
- `GET /logout` - Logout
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback

### Notes
- `GET /` - Home page (protected)
- `POST /create` - Create note (protected)
- `POST /delete/:id` - Delete note (protected)
- `GET /about` - About page (protected)

## 🚀 Deployment

For production deployment:

1. Use environment variables for all secrets
2. Set `NODE_ENV=production`
3. Use HTTPS for Google OAuth
4. Deploy to Heroku, AWS, DigitalOcean, etc.
5. Use MongoDB Atlas for cloud database
6. Update Google OAuth redirect URIs

Example Heroku deployment:
```bash
heroku create your-app-name
heroku config:set JWT_SECRET="your_secret"
heroku config:set GOOGLE_CLIENT_ID="your_id"
heroku config:set GOOGLE_CLIENT_SECRET="your_secret"
git push heroku main
```

## 📄 License

MIT License - feel free to use this project!

## 🤝 Contributing

Contributions welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📧 Questions?

For issues or questions, please create a GitHub issue and feel free to contribute.

---


