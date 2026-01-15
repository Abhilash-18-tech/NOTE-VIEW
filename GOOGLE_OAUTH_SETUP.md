# Google OAuth Setup Guide

## 🔐 How to Set Up Google OAuth

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (name it "Notes App" or similar)
3. Search for and enable **"Google+ API"**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Web Application**
6. Add these URIs:
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/auth/google/callback`
7. Copy your **Client ID** and **Client Secret**

### Step 2: Update index.js

Replace these lines in `index.js` (lines 14-15):

```javascript
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';
const GOOGLE_CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET_HERE';
```

With your actual credentials from Google Cloud Console:

```javascript
const GOOGLE_CLIENT_ID = '123456789-abc.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'your_secret_key_here';
```

### Step 3: Start the Server

```bash
node index.js
```

### Step 4: Test Google Sign In

1. Open http://localhost:3000/login
2. Click "Sign in with Google"
3. Select your Google account
4. You'll be logged in and redirected to the home page

---

## 📋 What Was Added

### Backend (index.js):
- ✅ Passport.js configuration
- ✅ Google OAuth Strategy setup
- ✅ `/auth/google` route - initiates Google login
- ✅ `/auth/google/callback` route - handles Google response
- ✅ User serialization/deserialization
- ✅ Automatic user creation if doesn't exist

### Frontend (login.ejs & register.ejs):
- ✅ "Sign in with Google" button with Google logo
- ✅ Divider line "or" between password login and Google login
- ✅ Responsive styling
- ✅ Hover effects on Google button

### How It Works:
1. User clicks "Sign in with Google"
2. Redirects to Google's login page
3. Google redirects back to `/auth/google/callback` with user info
4. Backend creates user if not exists
5. JWT token is created and stored in cookie
6. User is logged in and redirected to home page

---

## 🔒 Security Notes

- Never commit your Google Client Secret to Git!
- For production, use environment variables:
  ```javascript
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  ```
- Add to `.env` file:
  ```
  GOOGLE_CLIENT_ID=your_id_here
  GOOGLE_CLIENT_SECRET=your_secret_here
  ```

---

## 🐛 Troubleshooting

**Error: "redirect_uri_mismatch"**
- Make sure `http://localhost:3000/auth/google/callback` is in your Google Console settings

**Error: "Client not found"**
- Check that your Client ID is correct in index.js

**User not logging in**
- Check browser console for errors
- Check server terminal logs

---

## ✨ Features

- ✅ Single-click login with Google
- ✅ Automatic user creation
- ✅ JWT-based authentication
- ✅ Works with existing email/password login
- ✅ Beautiful, modern UI
- ✅ Real-world production-ready code

---

**Questions?** The Google OAuth flow is now fully integrated! 🚀
