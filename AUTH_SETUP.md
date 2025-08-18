# User Authentication Setup

This document explains the user authentication system that has been implemented in your MERN stack budgeting application.

## Overview

The authentication system includes:
- User registration with validation
- User login with JWT tokens
- Protected routes that require authentication
- User-specific data isolation
- Password change functionality

## Backend Changes

### 1. Updated Models

**User Model** (`server/models/User.js`):
- Added `firstName`, `lastName`, and `username` fields
- Maintains existing `email` and `passwordHash` fields

**Category Model** (`server/models/Category.js`):
- Added `user` field to associate categories with users

**Transaction Model** (`server/models/Transaction.js`):
- Added `user` field to associate transactions with users

### 2. New Authentication Routes

**Auth Routes** (`server/routes/authRoutes.js`):
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user info
- `PUT /api/v1/auth/change-password` - Change password

### 3. Protected Routes

All existing routes now require authentication:
- `/api/v1/categories/*` - Category management
- `/api/v1/transactions/*` - Transaction management
- `/api/v1/budget/*` - Budget summary

### 4. Authentication Middleware

**Auth Middleware** (`server/middleware/auth.js`):
- Validates JWT tokens
- Extracts user information from tokens
- Provides user context to route handlers

## Frontend Changes

### 1. Authentication Context

**AuthContext** (`client/src/contexts/AuthContext.jsx`):
- Manages user state and authentication status
- Provides login, register, and logout functions
- Handles token storage and API requests

### 2. Protected Route Component

**ProtectedRoute** (`client/src/components/ProtectedRoute.jsx`):
- Wraps components that require authentication
- Redirects unauthenticated users to login

### 3. Updated Components

**Login Page** (`client/src/pages/Login/Login.jsx`):
- Integrates with authentication context
- Handles login errors and success
- Redirects to dashboard on successful login

**Signup Page** (`client/src/pages/Signup/Signup.jsx`):
- Integrates with authentication context
- Handles registration errors and success
- Redirects to dashboard on successful registration

**NavBar** (`client/src/components/layout/NavBar.jsx`):
- Shows different options for authenticated/unauthenticated users
- Displays user's first name when logged in
- Provides logout functionality

### 4. API Hooks

**useApi Hook** (`client/src/hooks/useApi.js`):
- Custom hooks for API calls with authentication
- Includes hooks for categories, transactions, and budget
- Handles authenticated requests automatically

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the `server` directory:

```env
MONGODB_URI=mongodb://localhost:27017/cache_budget
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
FRONTEND_URL=http://localhost:3000
PLAID_ENV=sandbox
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PORT=5000
```

**Important**: Generate a strong, random JWT secret for production!

### 2. Database Migration

Since we added user references to existing models, you may need to:

1. **For new installations**: The app will work as expected
2. **For existing data**: You'll need to either:
   - Clear your existing categories and transactions
   - Or write a migration script to associate existing data with a user

### 3. Testing the Authentication

1. **Start the servers**:
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm start
   ```

2. **Test the flow**:
   - Go to `/signup` to create a new account
   - Login with your credentials at `/login`
   - Access protected routes like `/dashboard`
   - Try creating categories and transactions (they'll be user-specific)
   - Test logout functionality

### 4. User Experience Flow

1. **New User**:
   - Visits the app
   - Clicks "Sign Up"
   - Fills out registration form (first name, last name, email, username, password)
   - Gets automatically logged in and redirected to dashboard
   - Can create categories and transactions specific to their account

2. **Returning User**:
   - Visits the app
   - Clicks "Login"
   - Enters email and password
   - Gets redirected to dashboard
   - Sees only their own data (categories, transactions, budget)

3. **Data Isolation**:
   - Each user only sees and can modify their own data
   - Categories and transactions are filtered by user ID
   - Budget calculations are based on user-specific data

## Security Features

- Passwords are hashed using bcrypt with 12 salt rounds
- JWT tokens expire after 7 days
- All sensitive routes require authentication
- User data is isolated by user ID
- Input validation on both frontend and backend
- CORS protection configured for your frontend URL

## Next Steps

1. **Password Reset**: Implement forgot password functionality
2. **Email Verification**: Add email verification during registration
3. **Session Management**: Consider implementing refresh tokens
4. **User Profile Updates**: Allow users to update their profile information
5. **Account Deletion**: Implement account deletion functionality

## Troubleshooting

**Common Issues**:

1. **"No token provided" errors**: Make sure the frontend is sending the Authorization header
2. **CORS errors**: Check that FRONTEND_URL in .env matches your frontend URL
3. **Database connection issues**: Ensure MongoDB is running and MONGODB_URI is correct
4. **JWT errors**: Verify JWT_SECRET is set and consistent

**Debugging Tips**:
- Check browser console for frontend errors
- Check server logs for backend errors
- Use browser dev tools to inspect network requests
- Verify JWT tokens are being stored in localStorage
