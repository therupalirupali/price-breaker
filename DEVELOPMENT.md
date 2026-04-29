# Price Breaker - Development Guide

## Table of Contents

- [Development Workflow](#development-workflow)
- [Project Architecture](#project-architecture)
- [Component Overview](#component-overview)
- [State Management](#state-management)
- [Authentication Flow](#authentication-flow)
- [Code Style](#code-style)
- [Common Development Tasks](#common-development-tasks)
- [Debugging Guide](#debugging-guide)

---

## Development Workflow

### Starting Development

```bash
# 1. Install dependencies (first time only)
npm install

# 2. Start development server with hot reload
npm run dev

# 3. Open http://localhost:5173 in browser
# Changes are automatically reflected!
```

### Development Server Features

- **Hot Module Replacement (HMR)**: Instantly reload when you save
- **Fast Refresh**: React component changes preserve state
- **Source Maps**: Debug original TypeScript code
- **Error Overlay**: See build errors in browser

### Building & Testing

```bash
# Check for TypeScript errors
npm run build

# Lint code for issues
npm run lint

# Preview production build
npm run preview
```

---

## Project Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────┐
│                  React App                      │
│  ┌─────────────────────────────────────────┐  │
│  │         App.tsx (Main Component)        │  │
│  │  - Routes between Login/Main app        │  │
│  │  - Loads contexts                       │  │
│  └─────────────────────────────────────────┘  │
│                      │                         │
│      ┌───────────────┼───────────────┐        │
│      ▼               ▼               ▼        │
│  ┌────────┐  ┌────────────┐  ┌──────────┐   │
│  │ Header │  │Calculator  │  │Settings  │   │
│  └────────┘  └────────────┘  └──────────┘   │
│      │            │              │           │
│      └─────────────┴──────────────┘           │
│                  │                           │
│      ┌───────────┴───────────┐              │
│      ▼                       ▼              │
│  ┌──────────┐        ┌────────────┐       │
│  │AuthCtx   │        │ConfigCtx   │       │
│  │(State)   │        │(State)     │       │
│  └──────────┘        └────────────┘       │
│      │                      │              │
│      └──────────┬───────────┘              │
│               ▼                           │
│         localStorage                     │
│  (Tokens & Settings)                    │
└─────────────────────────────────────────────────┘
```

### Folder Structure

```
src/
├── components/                 # React components (UI)
│   ├── Calculator.tsx         # Making charge calculator
│   ├── Calculator.css         # Calculator styling
│   ├── Header.tsx             # App header with user info
│   ├── Header.css             # Header styling
│   ├── Login.tsx              # Login/signup form
│   ├── Login.css              # Login styling
│   ├── Settings.tsx           # Configuration panel
│   ├── Settings.css           # Settings styling
│   └── ProtectedRoute.tsx     # Route protection wrapper
│
├── context/                    # React Context (State Management)
│   ├── AuthContext.tsx        # Authentication state & functions
│   └── ConfigContext.tsx      # Configuration state & functions
│
├── utils/                      # Utility functions
│   └── navigationUtils.ts     # Navigation helper functions
│
├── App.tsx                     # Main application component
├── main.tsx                    # Application entry point
├── App.css                     # Global application styles
└── index.css                   # Base CSS styles
```

---

## Component Overview

### Components Hierarchy

```
App
└── AuthProvider (Context)
    └── AppContent
        ├── Loading Screen (if loading)
        ├── Login (if not authenticated)
        └── Main App (if authenticated)
            ├── Header
            ├── Calculator
            └── Settings
```

### Component Responsibilities

#### **App.tsx**

- Main application wrapper
- Provides AuthProvider context
- Handles routing between login and main app

#### **Header.tsx**

- Displays user email and role
- Shows logout button
- Updates when user changes

#### **Calculator.tsx**

- Input: Final Price
- Output: Making Charge calculation
- Uses: ConfigContext for metal price and GST
- Formula: `Making Charge = (Final Price / (1 + GST%)) - Metal Price`

#### **Settings.tsx**

- Input: Current Metal Price, GST Percentage
- Output: Saves to localStorage via ConfigContext
- Persists across sessions

#### **Login.tsx**

- Authentication form
- Handles login and registration
- Uses: AuthContext for auth functions
- Shows demo credentials

#### **ProtectedRoute.tsx**

- Wrapper component
- Redirects unauthenticated users
- Checks authentication state

---

## State Management

### React Context API

The app uses React Context API for global state (not Redux):

#### **AuthContext** (`src/context/AuthContext.tsx`)

```typescript
interface AuthContextType {
  user: User | null; // Logged-in user
  token: string | null; // JWT token
  isAuthenticated: boolean; // Auth status
  loading: boolean; // Loading state
  login: (email, password) => Promise<void>;
  logout: () => void;
  register: (email, password) => Promise<void>;
}
```

**Usage in Components:**

```typescript
import { useAuth } from "../context/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  // Use auth state and functions
}
```

#### **ConfigContext** (`src/context/ConfigContext.tsx`)

```typescript
interface Config {
  currentMetalPrice: number;
  gstPercentage: number;
}

interface ConfigContextType {
  config: Config;
  updateConfig: (newConfig: Partial<Config>) => void;
}
```

**Usage in Components:**

```typescript
import { useConfig } from "../context/ConfigContext";

function MyComponent() {
  const { config, updateConfig } = useConfig();
  // Use config state and update function
}
```

### Data Flow

```
User Action (e.g., login)
         ↓
Component calls context function (e.g., login())
         ↓
Context updates state
         ↓
useAuth/useConfig hook triggers re-render
         ↓
Component receives new state and renders
```

---

## Authentication Flow

### Login Sequence

```
1. User enters email/password in Login.tsx
                    ↓
2. User clicks "Sign In"
                    ↓
3. Login.tsx calls context login() function
                    ↓
4. AuthContext generates mock JWT token
                    ↓
5. Token stored in localStorage
                    ↓
6. User state updated in context
                    ↓
7. App.tsx detects isAuthenticated = true
                    ↓
8. Main app (Calculator + Settings) displays
```

### Token Structure (Demo)

```
Header.Payload.Signature

Payload (Base64 encoded):
{
  "user": {
    "id": "user_1234567890123",
    "email": "user@example.com",
    "role": "user"  // or "admin"
  },
  "iat": 1234567890,    // Issued at (timestamp)
  "exp": 1234654290     // Expiration (24 hours later)
}
```

### Token Expiration Check

```typescript
// In AuthContext.tsx on app startup:

const savedToken = localStorage.getItem("authToken");
if (savedToken) {
  const decoded = decodeToken(savedToken);

  // Check if token is still valid
  if (decoded.exp * 1000 > Date.now()) {
    // Token valid, restore user session
    setToken(savedToken);
    setUser(decoded.user);
  } else {
    // Token expired, remove it
    localStorage.removeItem("authToken");
  }
}
```

### Logout Sequence

```
1. User clicks "Logout" in Header
                    ↓
2. Header calls logout() from AuthContext
                    ↓
3. AuthContext clears state
    - user = null
    - token = null
    - isAuthenticated = false
                    ↓
4. localStorage.removeItem('authToken')
                    ↓
5. App.tsx detects isAuthenticated = false
                    ↓
6. Login page displays
```

---

## Code Style

### TypeScript

Use strict TypeScript typing:

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  role: "user" | "admin";
}

const handleLogin = async (email: string, password: string): Promise<void> => {
  // implementation
};

// ❌ Bad
const handleLogin = async (email, password) => {
  // Missing types
};

const user: any = {}; // Avoid 'any'
```

### Component Naming

```typescript
// ✅ Good - PascalCase for components
export const Calculator: React.FC = () => {};
export const Header: React.FC = () => {};

// ❌ Bad - camelCase
export const calculator: React.FC = () => {};
```

### File Naming

```
// ✅ Good
Calculator.tsx        // Component file
Calculator.css        # Styles file
authUtils.ts          // Utility file

// ❌ Bad
calculator.tsx        // Should be PascalCase
calculatorStyles.css  // Should be separate .css file
```

### Props Interface

```typescript
// ✅ Good
interface CalculatorProps {
  initialValue?: number;
  onCalculate?: (result: number) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  initialValue = 0,
  onCalculate,
}) => {
  // implementation
};

// ❌ Bad - No type checking
export const Calculator = ({ initialValue, onCalculate }) => {};
```

### Comments

```typescript
// ✅ Good - Meaningful comments
// Format: (amount / (1 + gst%)) - metalPrice
const makingCharge = finalPrice / gstFactor - metalPrice;

// ❌ Bad - Obvious comments
// Subtract metal price
const makingCharge = metalPlusMaking - metalPrice;
```

---

## Common Development Tasks

### Adding a New Component

1. **Create component file** (`src/components/MyComponent.tsx`):

   ```typescript
   import React from 'react';
   import './MyComponent.css';

   export const MyComponent: React.FC = () => {
     return <div>My Component</div>;
   };
   ```

2. **Create styles** (`src/components/MyComponent.css`):

   ```css
   .my-component {
     display: flex;
     flex-direction: column;
   }
   ```

3. **Import in App.tsx**:

   ```typescript
   import { MyComponent } from "./components/MyComponent";
   ```

4. **Use in JSX**:
   ```jsx
   <MyComponent />
   ```

### Adding Context State

1. **Create context file** (`src/context/MyContext.tsx`):

   ```typescript
   import React, { createContext, useState, useContext } from 'react';

   interface MyContextType {
     value: string;
     setValue: (val: string) => void;
   }

   const MyContext = createContext<MyContextType | undefined>(undefined);

   export const MyProvider: React.FC<{ children }> = ({ children }) => {
     const [value, setValue] = useState('');
     return (
       <MyContext.Provider value={{ value, setValue }}>
         {children}
       </MyContext.Provider>
     );
   };

   export const useMyContext = () => {
     const context = useContext(MyContext);
     if (!context) throw new Error('useMyContext must be inside MyProvider');
     return context;
   };
   ```

2. **Wrap App** (`src/App.tsx`):

   ```typescript
   <MyProvider>
     <YourApp />
   </MyProvider>
   ```

3. **Use in components**:
   ```typescript
   const { value, setValue } = useMyContext();
   ```

### Running Linting

```bash
# Check for linting errors
npm run lint

# View detailed output
npm run lint -- --format=detailed
```

### Building Production

```bash
# Compile and optimize
npm run build

# Output in dist/ folder
# Check dist/ folder size
ls -lh dist/
```

---

## Debugging Guide

### Browser DevTools

Open with F12 or Right-click → Inspect:

#### **Console Tab**

```javascript
// View stored data
console.log(localStorage.getItem("authToken"));
console.log(localStorage.getItem("config"));

// Clear storage
localStorage.clear();

// Set breakpoint
debugger;
```

#### **Application Tab**

- View localStorage contents
- View cookies
- Clear storage

#### **Network Tab**

- Monitor API calls (when connected to backend)
- Check response times
- Check for failed requests

#### **React DevTools**

Install React DevTools extension to:

- Inspect component props
- View component state
- Trace re-renders

### VS Code Debugging

1. **Install Debugger for Firefox/Chrome extension**

2. **Create `.vscode/launch.json`**:

   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "type": "chrome",
         "request": "launch",
         "name": "Launch Chrome",
         "url": "http://localhost:5173",
         "webRoot": "${workspaceFolder}/src",
         "preLaunchTask": "npm: dev"
       }
     ]
   }
   ```

3. **Start debugging** (F5)

### Common Debugging Scenarios

**Issue: Component not updating**

```typescript
// Add useEffect to see if state changes
useEffect(() => {
  console.log('State changed:', user);
}, [user]);

// Check if component has key prop (for lists)
{items.map(item => <Item key={item.id} item={item} />)}
```

**Issue: Context not working**

```typescript
// Verify provider wraps component
// Check: <MyProvider><App /></MyProvider>

// Verify hook is inside provider
// Move component inside provider if not

// Check console for hook error messages
```

**Issue: Infinite loops**

```typescript
// Problem: useEffect dependency array issues
useEffect(() => {
  // This might cause infinite loops
  setState(state + 1); // Missing dependency or wrong dependency
}, []);

// Solution: Add all used variables to dependencies
useEffect(() => {
  if (condition) {
    setState(value);
  }
}, [condition, value]);
```

---

## Performance Tips

### Optimization Techniques

1. **Memoization**:

   ```typescript
   const MemoizedComponent = React.memo(MyComponent);
   ```

2. **useCallback** for functions:

   ```typescript
   const handleClick = useCallback(() => {
     // function body
   }, [dependencies]);
   ```

3. **useMemo** for expensive calculations:

   ```typescript
   const result = useMemo(() => {
     return expensiveCalculation(data);
   }, [data]);
   ```

4. **Lazy loading components**:
   ```typescript
   const LazyComponent = React.lazy(() => import("./Component"));
   ```

---

## Deployment

### Production Build

```bash
# Create optimized build
npm run build

# Test production build locally
npm run preview
```

### Continuous Integration (CI/CD)

Add GitHub Actions workflow (`.github/workflows/build.yml`):

```yaml
name: Build and Deploy

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm install
      - run: npm run lint
      - run: npm run build
```

---

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev)
- [Context API Guide](https://react.dev/reference/react/useContext)
