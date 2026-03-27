# JWT Authentication & Authorization Guide

## Overview

Price Breaker now includes a complete JWT (JSON Web Token) authentication and authorization system. Users must log in before accessing the application.

## Authentication Features

### 1. **Login & Registration**
- Users can create new accounts or log in with existing credentials
- Mock JWT tokens are generated for demo purposes
- Tokens include user information and expiration time (24 hours)

### 2. **Token Management**
- Tokens are automatically saved to browser's localStorage
- Tokens are validated on app startup
- Expired tokens are automatically removed
- Users can log out to clear their session

### 3. **Role-Based Authorization**
- **User Role**: Standard users - can access calculator and update their own settings
- **Admin Role**: Admin users - can access all features (create admin account by using "admin@example.com")

### 4. **Protected Routes**
- Calculator and Settings components are protected
- Unauthenticated users see the login page
- Token expiration is checked automatically

## Getting Started

### Demo Credentials

Use these credentials to test the application:

**Regular User:**
- Email: `user@example.com`
- Password: `any password` (any value works in demo mode)

**Admin User:**
- Email: `admin@example.com`
- Password: `any password` (any value works in demo mode)

### Login Flow

1. On first visit, you'll see the login page
2. Enter email and password
3. Click "Sign In" to log in or create an account
4. After successful login, you'll be redirected to the calculator
5. Your email and role status appear in the header

## Implementation Details

### AuthContext (`src/context/AuthContext.tsx`)

Manages authentication state globally using React Context API:

```typescript
interface AuthContextType {
  user: User | null;           // Current logged-in user
  token: string | null;        // JWT token
  isAuthenticated: boolean;    // Auth status
  loading: boolean;            // Loading state
  login: (email, password) => Promise<void>;
  logout: () => void;
  register: (email, password) => Promise<void>;
}
```

### JWT Token Structure

Mock tokens follow the standard JWT format:

```
Header.Payload.Signature
```

**Payload contains:**
```json
{
  "user": {
    "id": "user_timestamp",
    "email": "user@example.com",
    "role": "user" // or "admin"
  },
  "iat": 1234567890,  // Issued at
  "exp": 1234654290   // Expiration (24 hours from issue)
}
```

### Login Component (`src/components/Login.tsx`)

- Email and password input fields
- Sign In / Sign Up toggle
- Validation and error handling
- Demo credentials display

### Header Component (`src/components/Header.tsx`)

Shows when user is authenticated:
- User's email address
- Admin badge (if user is admin)
- Logout button

### Protected Routes (`src/components/ProtectedRoute.tsx`)

Wraps components to ensure only authenticated users can access them:

```typescript
<ProtectedRoute>
  <Calculator />
</ProtectedRoute>
```

Optional role-based protection:

```typescript
<ProtectedRoute requiredRole="admin">
  <AdminOnlyFeature />
</ProtectedRoute>
```

## Authentication Flow

```
Start App
    ↓
AuthProvider checks localStorage for token
    ↓
Token valid? 
    ├─ YES → Load user data → Show App
    └─ NO → Show Login Page
             ↓
         User enters credentials
             ↓
         Generate token → Save to localStorage
             ↓
         Set user state → Show App
```

## Making Authenticated API Calls

The `apiRequest` utility automatically adds the JWT token to requests:

```typescript
import { apiRequest } from './utils/navigationUtils';

// Token is automatically included in Authorization header
const response = await apiRequest('/api/data', {
  method: 'GET',
});
```

## Token Utilities

Located in `src/utils/navigationUtils.ts`:

- `TokenManager.getToken()` - Retrieve token from storage
- `TokenManager.setToken(token)` - Save token to storage
- `TokenManager.removeToken()` - Clear token from storage
- `TokenManager.isTokenExpired(token)` - Check if token is expired
- `apiRequest(url, options)` - Make authenticated API requests

## Integration with Backend

To integrate with a real backend:

1. **Login Endpoint**: Replace mock token generation with API call
   ```typescript
   const response = await fetch('https://api.example.com/auth/login', {
     method: 'POST',
     body: JSON.stringify({ email, password })
   });
   const { token } = await response.json();
   ```

2. **Token Validation**: Validate tokens on server instead of client
   ```typescript
   const decoded = await verifyToken(token); // Backend validation
   ```

3. **Protected API Routes**: Use token in Authorization header
   ```typescript
   const response = await apiRequest('https://api.example.com/data');
   // Token is automatically included
   ```

## Security Considerations

### Current (Demo)
- Tokens are generated client-side
- No real password validation
- For demonstration purposes only

### Production Checklist
- [ ] Use HTTPS only
- [ ] Store tokens securely (consider httpOnly cookies)
- [ ] Validate tokens server-side
- [ ] Implement password hashing (bcrypt/argon2)
- [ ] Add refresh token mechanism
- [ ] Implement token revocation
- [ ] Add CSRF protection
- [ ] Set appropriate token expiration
- [ ] Use secure random token generation
- [ ] Monitor for suspicious login attempts
- [ ] Implement rate limiting on auth endpoints
- [ ] Add MFA (Multi-Factor Authentication)

## Logout

Users can log out by:
1. Clicking the "Logout" button in the header
2. Token and user data are cleared
3. User is redirected to login page

## File Structure

```
src/
├── context/
│   ├── AuthContext.tsx          # Authentication state management
│   └── ConfigContext.tsx        # Configuration context
├── components/
│   ├── Login.tsx                # Login/Sign up page
│   ├── Login.css
│   ├── Header.tsx               # Header with user info
│   ├── Header.css
│   ├── ProtectedRoute.tsx       # Route protection wrapper
│   ├── Calculator.tsx
│   ├── Settings.tsx
│   └── ...other components
├── utils/
│   └── navigationUtils.ts       # Token and API utilities
└── App.tsx                      # Main app with auth flow
```

## Troubleshooting

**Issue**: Always redirected to login
- **Solution**: Token might be expired. Try again with correct credentials.

**Issue**: "You don't have permission" message
- **Solution**: Switch to admin account (admin@example.com) if admin access is required.

**Issue**: Token not persisting after refresh
- **Solution**: Check browser's localStorage is enabled. Tokens are stored there.

## Next Steps

1. Connect to a real authentication backend
2. Implement proper password validation
3. Add refresh token mechanism
4. Set up role-based access control (RBAC) for features
5. Add social login (Google, GitHub, etc.)
6. Implement email verification
7. Add password recovery
8. Add MFA support
