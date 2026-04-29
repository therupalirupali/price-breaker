# Price Breaker - Project Structure & Architecture

## Table of Contents

- [Directory Structure](#directory-structure)
- [File Descriptions](#file-descriptions)
- [Technology Stack](#technology-stack)
- [Data Flow](#data-flow)
- [API Architecture](#api-architecture)
- [CSS Architecture](#css-architecture)

---

## Directory Structure

```
price-breaker/
│
├── src/                          # Source code directory
│   │
│   ├── components/               # React UI Components
│   │   ├── Calculator.tsx        # Making charge calculator component
│   │   ├── Calculator.css        # Calculator styles
│   │   ├── Header.tsx            # App header with user profile
│   │   ├── Header.css            # Header styles
│   │   ├── Login.tsx             # Authentication page
│   │   ├── Login.css             # Login styles
│   │   ├── Settings.tsx          # Configuration/settings panel
│   │   ├── Settings.css          # Settings styles
│   │   └── ProtectedRoute.tsx    # Route protection component
│   │
│   ├── context/                  # React Context (State Management)
│   │   ├── AuthContext.tsx       # Authentication state & logic
│   │   └── ConfigContext.tsx     # Configuration state & logic
│   │
│   ├── utils/                    # Utility Functions
│   │   └── navigationUtils.ts    # Navigation helper functions
│   │
│   ├── App.tsx                   # Main app component & routing
│   ├── main.tsx                  # React app entry point
│   ├── App.css                   # Global app styles
│   └── index.css                 # Base styles & variables
│
├── public/                       # Static assets (if any)
│
├── dist/                         # Production build output (generated)
│   ├── index.html
│   ├── assets/
│   │   ├── *.js                  # Bundled JavaScript
│   │   └── *.css                 # Bundled CSS
│   └── ...
│
├── node_modules/                 # Dependencies (generated)
│   └── [all installed packages]
│
├── index.html                    # HTML entry point
├── tsconfig.json                 # TypeScript configuration
├── tsconfig.node.json            # TypeScript config for Node tools
├── vite.config.ts                # Vite build configuration
├── package.json                  # Project metadata & dependencies
├── package-lock.json             # Dependency lock file
│
├── README.md                     # Project overview
├── AUTH.md                       # Authentication guide
├── SETUP.md                      # Setup & usage guide
├── DEVELOPMENT.md                # Development guide
└── PROJECT_STRUCTURE.md          # This file

```

---

## File Descriptions

### Root Configuration Files

#### `package.json`

**Purpose:** Project metadata and dependency management

```json
{
  "name": "price-breaker",
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite", // Start dev server
    "build": "tsc && vite build", // Build for production
    "lint": "eslint ...", // Check code style
    "preview": "vite preview" // Preview production build
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    // Build tools, linters, TypeScript, etc.
  }
}
```

#### `tsconfig.json`

**Purpose:** TypeScript compiler options

- Target: ES2020
- Module: ESNext
- Strict mode: enabled
- jsx: react-jsx

#### `vite.config.ts`

**Purpose:** Vite bundler configuration

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
```

#### `index.html`

**Purpose:** HTML template for React app

```html
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

### Source Code Files

#### `src/main.tsx`

**Purpose:** Application entry point

```typescript
// Mount React app to DOM
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

#### `src/App.tsx`

**Purpose:** Main application component

```
├── Provides AuthProvider context
├── Routes between Login and Main App
├── Shows loading state
└── Renders Header, Calculator, Settings if authenticated
```

#### `src/components/`

**Calculator.tsx**

- Input form for final price
- Calculation logic
- Displays results with breakdown
- Uses ConfigContext for settings

**Settings.tsx**

- Input fields for metal price and GST
- Save functionality
- Updates ConfigContext
- Persists to localStorage

**Login.tsx**

- Email and password form
- Sign In / Sign Up toggle
- Calls AuthContext login/register
- Shows demo credentials

**Header.tsx**

- Displays user email and role
- Logout button
- Responsive header layout

**ProtectedRoute.tsx**

- Wrapper component
- Checks authentication
- Redirects if not authenticated

#### `src/context/`

**AuthContext.tsx**

```typescript
// Manages:
├── User state (email, role)
├── JWT token
├── Login function
├── Logout function
├── Register function
└── Token persistence (localStorage)
```

**ConfigContext.tsx**

```typescript
// Manages:
├── Current metal price
├── GST percentage
├── Update function
└── Configuration persistence
```

#### `src/utils/navigationUtils.ts`

**Purpose:** Navigation helper functions

```typescript
// Might include:
├── URL generation
├── Route builders
└── Navigation helpers
```

### Style Files

**Global Styles:**

- `src/index.css` - Base CSS variables and reset
- `src/App.css` - Global app layout

**Component Styles:**

- `src/components/[Component].css` - Component-specific styles

---

## Technology Stack

### Frontend Framework

- **React 18.2.0** - UI library for building components
  - Virtual DOM for efficient rendering
  - Hooks for state management
  - Context API for global state

### Language & Type Safety

- **TypeScript 5.2** - Adds static typing to JavaScript
  - Type checking at development time
  - Better IDE support
  - Catches errors before runtime

### Build Tool

- **Vite 5.0** - Modern build tool
  - Fast development server with HMR
  - Optimized production builds
  - ESNext module support

### Code Quality

- **ESLint 8.56** - Code style linter
  - Catches potential bugs
  - Enforces code standards
  - React plugin for best practices

### Development Tools

- **Node.js** - JavaScript runtime
- **npm** - Package manager

### Browser APIs Used

- **localStorage** - Client-side data persistence
- **JSON** - Data serialization
- **Fetch API** - (Ready for backend integration)

---

## Data Flow

### Authentication Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Startup                      │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│        AuthContext checks localStorage for token           │
│                                                             │
│  1. Get saved token: localStorage.getItem('authToken')     │
│  2. Decode and validate token                              │
│  3. Check if expired: decoded.exp * 1000 > Date.now()      │
│  4. If valid: restore user session                         │
│  5. If invalid: clear token                                │
└─────────────────────────────────────────────────────────────┘
                           │
                 ┌─────────┴─────────┐
                 │                   │
                 ▼                   ▼
          ┌──────────────┐    ┌──────────────────┐
          │  Authenticated   │  Not Authenticated  │
          └──────────────┘    └──────────────────┘
                 │                   │
                 ▼                   ▼
          ┌──────────────┐    ┌──────────────────┐
          │  Main App    │    │  Login Page      │
          │  (Calculator)│    │                  │
          └──────────────┘    └──────────────────┘
```

### Calculation Data Flow

```
User enters Final Price
          │
          ▼
User clicks Calculate button
          │
          ▼
Calculator.tsx reads from ConfigContext:
  ├── currentMetalPrice
  └── gstPercentage
          │
          ▼
Apply formula:
  gstFactor = 1 + gstPercentage / 100
  metalPlusMaking = finalPrice / gstFactor
  makingCharge = metalPlusMaking - metalPrice
  gstAmount = metalPlusMaking * (gstPercentage / 100)
          │
          ▼
Display results and breakdown
```

### Configuration Data Flow

```
User updates settings (metal price or GST)
          │
          ▼
Calls updateConfig() from ConfigContext
          │
          ▼
ConfigContext updates state
          │
          ▼
Save to localStorage:
  localStorage.setItem('config', JSON.stringify(config))
          │
          ▼
All components reading from ConfigContext re-render
          │
          ▼
Calculator uses new values for calculations
```

### Component Render Tree

```
<App>
  <AuthProvider>
    <AppContent>
      {isAuthenticated ? (
        <ConfigProvider>
          <Header />
          <Calculator />
          <Settings />
        </ConfigProvider>
      ) : (
        <Login />
      )}
    </AppContent>
  </AuthProvider>
</App>
```

---

## API Architecture

### Current (Demo) Architecture

```
Frontend (React)
    │
    ├── AuthContext (Mock JWT generation)
    │   └── localStorage (Token storage)
    │
└── ConfigContext (Settings management)
        └── localStorage (Config storage)
```

### Future (Production) Architecture

```
Frontend (React)
    │
    ├── AuthContext → REST API
    │   └── /api/auth/login (POST)
    │   └── /api/auth/register (POST)
    │   └── /api/auth/logout (POST)
    │   └── localStorage (Token cache)
    │
    └── ConfigContext → REST API
        └── /api/config/update (PUT)
        └── /api/config/get (GET)
```

### Environment Variables

Currently no environment file, but for production add `.env`:

```
VITE_API_BASE_URL=https://api.example.com
VITE_AUTH_ENDPOINT=https://api.example.com/auth
VITE_CONFIG_ENDPOINT=https://api.example.com/config
```

---

## CSS Architecture

### CSS Structure

```
index.css (Base styles)
  ├── CSS Variables
  ├── Reset/Normalize
  └── Typography

App.css (Global layout)
  ├── .app (Container)
  ├── .container (Content wrapper)
  ├── .loading-screen (Loader)
  └── .app-footer (Footer)

Component.css (Component styles)
  ├── .component-name (Main component)
  ├── .input-group (Inputs)
  ├── .button (Buttons)
  └── .results (Results display)
```

### CSS Variables

```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --spacing-unit: 8px;
  --border-radius: 4px;
  --font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
    Cantarell, sans-serif;
}
```

### Responsive Design

```css
/* Mobile First Approach */
.container {
  width: 100%;
  padding: 16px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    width: 750px;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    width: 1000px;
  }
}
```

---

## State Management Summary

### Global State (Context API)

**AuthContext State:**

```typescript
{
  user: { id, email, role },
  token: "jwt.token.here",
  isAuthenticated: boolean,
  loading: boolean
}
```

**ConfigContext State:**

```typescript
{
  currentMetalPrice: number,
  gstPercentage: number
}
```

### Local Component State

**Calculator Component:**

```typescript
{
  finalPrice: number,
  makingCharge: number,
  details: CalculationDetails
}
```

**Settings Component:**

```typescript
{
  metalPrice: number,
  gstPercentage: number
}
```

---

## Build & Deployment

### Development Build

```
src/ (TypeScript)
  ↓ (tsc compile)
dist/ (JavaScript)
  ↓ (Vite bundle)
bundled.js + bundled.css
```

### Production Build

```
src/ (TypeScript)
  ↓ (TypeScript compile)
  ↓ (Code split)
  ↓ (Minify)
  ↓ (Hash filenames)
dist/ (Production ready)
  ├── index.html
  ├── assets/
  │   ├── index-abc123.js (Minified)
  │   └── index-def456.css (Minified)
  └── ...
```

### Build Output Size

Typical production build:

- JavaScript: ~50-100KB (gzipped)
- CSS: ~5-10KB (gzipped)
- Total: ~55-110KB

---

## Security Considerations

### Current (Demo) Implementation

⚠️ **Security Notes:**

- Tokens are generated client-side (not secure for production)
- No HTTPS enforcement
- Mock authentication (anyone can log in)
- Passwords not validated

### Production Recommendations

1. **Backend Authentication**
   - Validate credentials server-side
   - Generate JWT tokens on backend
   - Use HTTPS only

2. **Token Security**
   - Use HttpOnly cookies for tokens
   - Implement refresh tokens
   - Short expiration times

3. **Data Security**
   - CORS configuration
   - Rate limiting
   - Input validation
   - HTTPS/TLS encryption

4. **Code Security**
   - Regular dependency updates
   - Security headers (CSP, X-Frame-Options)
   - Regular security audits
   - OWASP Top 10 compliance

---

## Performance Considerations

### Current Optimizations

✅ **Already Implemented:**

- React Fast Refresh (dev mode)
- Code splitting by Vite
- Tree shaking (unused code removed)
- CSS scoped to components

### Future Optimizations

⚠️ **Could Improve:**

- Add React.memo() to prevent re-renders
- Use useCallback() for event handlers
- Use useMemo() for expensive calculations
- Lazy load components
- Image optimization
- Service Worker for offline support
- CDN for static assets

---

## File Size Reference

```
node_modules/           ~400MB (never shipped)
dist/ (Production)      ~100KB (gzipped)
src/ (Source)           ~30KB
package.json            ~1KB
Configuration files     ~5KB
```

---

## Dependencies Overview

### Production Dependencies

- `react@18.2.0` - UI library
- `react-dom@18.2.0` - React DOM rendering

### Development Dependencies

- `typescript@5.2.2` - TypeScript compiler
- `vite@5.0.8` - Build tool
- `eslint@8.56.0` - Linter
- `@vitejs/plugin-react@4.2.1` - React plugin for Vite
- `@types/react@18.2.43` - Type definitions
- `@types/react-dom@18.2.17` - Type definitions
- `@typescript-eslint/*` - ESLint TypeScript support

---

## Maintenance & Upgrades

### Regular Maintenance

```bash
# Check for outdated packages
npm outdated

# Audit security vulnerabilities
npm audit

# Update packages
npm update

# Update major versions (be careful)
npm install react@latest
```

### Version Compatibility

- Node.js: v16+
- npm: v7+
- React: 18.2+
- TypeScript: 5.2+

---

## Related Documentation

- [SETUP.md](./SETUP.md) - Getting started guide
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development workflow
- [AUTH.md](./AUTH.md) - Authentication details
- [README.md](./README.md) - Project overview
