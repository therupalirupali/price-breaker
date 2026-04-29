# Price Breaker - Setup & Usage Guide

## Table of Contents

- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Installation Steps](#installation-steps)
- [Running the Application](#running-the-application)
- [Using the Application](#using-the-application)
- [Demo Credentials](#demo-credentials)
- [Environment Setup](#environment-setup)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

If you're in a hurry, here are the essential commands:

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open http://localhost:5173 in your browser
```

That's it! You can now log in using the demo credentials.

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required

- **Node.js**: v16 or higher (check with `node --version`)
- **npm**: v7 or higher (check with `npm --version`)
  - Alternative: **yarn** v1.22 or higher (check with `yarn --version`)

### Optional but Recommended

- **Git**: For version control (check with `git --version`)
- **VS Code**: For code editing (https://code.visualstudio.com)

### How to Install Node.js

1. Visit [nodejs.org](https://nodejs.org)
2. Download the LTS (Long Term Support) version
3. Run the installer and follow the prompts
4. Verify installation by running:
   ```bash
   node --version
   npm --version
   ```

---

## Installation Steps

### Step 1: Clone or Navigate to Project

```bash
# If cloning from repository
git clone <repository-url>
cd price-breaker

# If already in the directory
cd price-breaker
```

### Step 2: Install Dependencies

```bash
# Using npm
npm install

# OR using yarn
yarn install
```

This command reads `package.json` and installs all required dependencies in a `node_modules` folder.

**What gets installed:**

- React 18.2.0 - UI framework
- TypeScript 5.2 - Type safety
- Vite 5.0 - Build tool
- ESLint - Code linter
- Other development tools

### Step 3: Verify Installation

```bash
npm --version
node --version
npm list react
```

---

## Running the Application

### Development Mode (Recommended for Development)

```bash
npm run dev
```

**Output:**

```
  VITE v5.0.8 ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Features in Dev Mode:**

- Hot Module Replacement (HMR) - Changes appear instantly
- Detailed error messages
- Source maps for debugging
- No minification (easier to debug)

### Build for Production

```bash
npm run build
```

**Output:**

```
dist/
├── index.html
├── assets/
│   ├── index-abc123.js
│   └── index-def456.css
```

**What happens:**

- TypeScript is compiled to JavaScript
- Code is optimized and minified
- Assets are bundled efficiently
- Output is in the `dist/` folder

### Preview Production Build

```bash
npm run preview
```

Opens a local preview of your production build at `http://localhost:4173`.

---

## Using the Application

### First Login

1. **Open the App**: Navigate to http://localhost:5173
2. **See Login Screen**: You'll see the login/signup form
3. **Enter Credentials**: Use demo credentials (see below)
4. **Click "Sign In"**: Submit the login form
5. **Welcome**: You're now logged in and can see the calculator

### Main Application Features

#### 1. **Calculator Section**

Use to calculate making charges:

```
Input:  Final Price (₹)
        Current Metal Price (from Settings)
        GST % (from Settings)

Output: Making Charge (₹)
        Detailed Breakdown
```

**Steps to Calculate:**

1. Enter the **Final Price** (the price you want to achieve)
2. Ensure Metal Price and GST % are set in Settings
3. Click **Calculate**
4. View the breakdown showing:
   - Metal Price component
   - Making Charge component
   - GST Amount
   - Total

**Formula:**

```
Making Charge = (Final Price ÷ (1 + GST%)) - Metal Price
```

#### 2. **Settings Section**

Configure pricing parameters:

```
Current Metal Price (₹): Update the base metal price
GST Percentage (%):     Update the tax percentage
```

**Steps to Update Settings:**

1. Enter new values in the input fields
2. Click **Save Settings**
3. Settings are saved to your browser's localStorage
4. Settings persist even after closing the browser

### User Profile (Header)

Shows your current login status:

- Your email address
- Your role (User or Admin)
- Logout button to end your session

---

## Demo Credentials

### Option 1: Regular User

```
Email:    user@example.com
Password: any password (demo accepts any value)
```

**Permissions:** Can access calculator and update own settings.

### Option 2: Admin User

```
Email:    admin@example.com
Password: any password (demo accepts any value)
```

**Permissions:** Can access all features (same as regular user in current version).

### Important Notes

⚠️ **Demo Mode Only:**

- Any password is accepted
- No real authentication against a backend
- Tokens are generated locally
- For production, you must implement real backend authentication

---

## Environment Setup

### Project Structure

```
price-breaker/
├── src/
│   ├── components/          # React components
│   ├── context/             # React Context (state management)
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── *.css                # Stylesheets
├── index.html               # HTML template
├── package.json             # Dependencies & scripts
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
├── README.md                # Project overview
├── AUTH.md                  # Authentication details
└── SETUP.md                 # This file
```

### Configuration Files

#### `package.json`

Defines project metadata and scripts:

- **scripts**: Commands like `npm run dev`, `npm run build`
- **dependencies**: Runtime dependencies (React, React-DOM)
- **devDependencies**: Development-only tools (TypeScript, Vite, ESLint)

#### `tsconfig.json`

TypeScript compiler options:

- Target: ES2020
- Module: ESNext
- Strict mode enabled

#### `vite.config.ts`

Vite bundler configuration:

- React plugin enabled
- Port 5173 for dev server

### Browser Storage

The application uses **localStorage** to persist data:

```javascript
// Authentication Token
localStorage.getItem("authToken");
localStorage.setItem("authToken", token);

// Settings
localStorage.getItem("config");
localStorage.setItem("config", JSON.stringify(config));
```

**Clear Storage (if needed):**

1. Open Browser DevTools (F12)
2. Go to Application → Local Storage
3. Find `http://localhost:5173`
4. Right-click and delete, or use console:
   ```javascript
   localStorage.clear();
   ```

---

## Troubleshooting

### Issue: "npm: command not found"

**Solution:** Node.js is not installed or not in PATH.

1. Install Node.js from [nodejs.org](https://nodejs.org)
2. Restart your terminal
3. Verify: `node --version`

### Issue: "Port 5173 already in use"

**Solution:** Another process is using the port.

1. Kill the process using the port
2. Or specify a different port:
   ```bash
   npm run dev -- --port 3000
   ```
   Then visit http://localhost:3000

### Issue: "Cannot find module 'react'"

**Solution:** Dependencies not installed.

1. Run: `npm install`
2. Delete `node_modules` folder and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

### Issue: "Login not working"

**Solution:** Check the following:

1. Verify you're using correct email format (e.g., user@example.com)
2. Check browser console for errors (F12 → Console)
3. Ensure localStorage is enabled in browser
4. Try clearing browser cache/cookies
5. Try a different browser

### Issue: "Settings not saving"

**Solution:** localStorage may be disabled.

1. Check browser privacy settings
2. Ensure localStorage is enabled for localhost
3. Check browser console for errors (F12 → Console)
4. Try clearing browser cache

### Issue: "Application loading but nothing appears"

**Solution:** Check the following:

1. Open browser DevTools (F12)
2. Check Console tab for JavaScript errors
3. Check Network tab to see if files loaded
4. Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
5. Clear browser cache

### Issue: "Build fails with TypeScript errors"

**Solution:** Fix TypeScript errors.

1. Run: `npm run build` to see full error messages
2. Common errors:
   - Missing type definitions
   - Type mismatches
   - Invalid JSX syntax
3. Fix the errors in the source files
4. Retry build

### Debug Mode

Enable detailed logging in browser console:

1. Open DevTools (F12)
2. Go to Console tab
3. Add to page console:

   ```javascript
   // Enable logging
   localStorage.setItem("DEBUG", "true");

   // View stored auth token
   console.log(localStorage.getItem("authToken"));

   // View stored config
   console.log(localStorage.getItem("config"));

   // Clear all storage
   localStorage.clear();
   ```

---

## Next Steps

After setting up:

1. **Explore Features**: Try the calculator with different values
2. **Update Settings**: Adjust metal price and GST to see changes
3. **Read Code**: Check `src/` folder to understand implementation
4. **Deploy**: When ready, follow deployment steps in README.md

---

## Support

For issues or questions:

1. Check this guide's Troubleshooting section
2. Review code comments in `src/` files
3. Check browser console for errors (F12 → Console)
4. Review README.md and AUTH.md for more details
