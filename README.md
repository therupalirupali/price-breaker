# Price Breaker - Metal Making Charge Calculator

A React application to calculate metal making charges based on final price and configured metal pricing, with JWT authentication and authorization.

## Features

- **JWT Authentication**: Secure login and signup with JWT token management
- **Role-Based Authorization**: Support for user and admin roles
- **Making Charge Calculator**: Input final price and automatically calculate the making charge based on current metal price and GST
- **Configuration Management**: Update current metal price and GST percentage through an intuitive UI
- **Persistent Storage**: Settings and authentication tokens are saved to localStorage and persist across sessions
- **Detailed Breakdown**: View detailed calculation breakdown including metal price, making charge, and GST amount
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Calculation Logic

The calculator uses the following formula:

```
Final Price = (Metal Price + Making Charge) × (1 + GST%)

Rearranged:
Metal Price + Making Charge = Final Price / (1 + GST%)
Making Charge = (Final Price / (1 + GST%)) - Metal Price
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Demo Credentials

To test the application, use these credentials:

**Regular User:**
```
Email: user@example.com
Password: any password
```

**Admin User:**
```
Email: admin@example.com
Password: any password
```

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

### Preview

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Calculator.tsx           # Making charge calculator component
│   ├── Calculator.css           # Calculator styling
│   ├── Settings.tsx             # Configuration settings component
│   ├── Settings.css             # Settings styling
│   ├── Login.tsx                # Login/Sign up component
│   ├── Login.css                # Login styling
│   ├── Header.tsx               # Header with user info and logout
│   ├── Header.css               # Header styling
│   └── ProtectedRoute.tsx       # Route protection wrapper
├── context/
│   ├── AuthContext.tsx          # JWT authentication state management
│   └── ConfigContext.tsx        # Configuration context
├── utils/
│   └── navigationUtils.ts       # Token and API utilities
├── App.tsx                      # Main application component
├── App.css                      # Application styling
├── main.tsx                     # Application entry point
└── index.css                    # Global styles
```

## Authentication & Authorization

This application includes JWT-based authentication and authorization:

- **Login/Signup**: Users can create accounts or sign in with email credentials
- **JWT Token Management**: Tokens are automatically generated, stored, and validated
- **Role-Based Access**: Support for "user" and "admin" roles
- **Protected Routes**: Calculator and settings components require authentication
- **Token Persistence**: Tokens are stored in localStorage and persist across sessions
- **Auto-Logout**: Expired tokens are automatically cleared

**See [AUTH.md](./AUTH.md) for detailed authentication documentation.**

### Authentication Flow

1. User visits the app → Login page is displayed
2. User enters email and password → JWT token is generated
3. Token is stored in localStorage → User is logged in
4. User can access protected features (calculator, settings)
5. User clicks logout → Token is cleared and user returns to login

### Making Authenticated API Calls

The `apiRequest` utility automatically adds JWT tokens to requests:

```typescript
import { apiRequest } from './utils/navigationUtils';

const response = await apiRequest('/api/endpoint', {
  method: 'POST',
  body: JSON.stringify(data),
});
// Authorization header with Bearer token is automatically included
```

## Usage

### Calculator
1. Enter the final price (including GST) in the "Final Price" field
2. Click "Calculate Making Charge"
3. View the breakdown of:
   - Metal price
   - Making charge
   - GST amount
   - Percentage of making charge relative to metal price

### Settings
1. Update the current metal price
2. Adjust the GST percentage
3. Click "Save Configuration"
4. Settings are automatically saved and will persist across sessions

## Configuration Storage

Configuration is stored in browser's localStorage under the key `priceBreakerConfig`. The stored data includes:
- `currentMetalPrice`: Current market price of metal
- `gstPercentage`: GST rate to be applied

## Technologies Used

- **React 18**: UI framework
- **TypeScript**: Type-safe development
- **Vite**: Build tool and development server
- **CSS3**: Styling with gradients and responsive design

## License

MIT

## Support

For issues or feature requests, please open an issue in the repository.
