/**
 * @fileoverview Main application component
 * Handles routing between login and main app based on authentication state.
 * Uses AuthContext to check if user is authenticated.
 */

import { AuthProvider, useAuth } from './context/AuthContext';
import { ConfigProvider } from './context/ConfigContext';
import { Calculator } from './components/Calculator';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { Header } from './components/Header';
import './App.css';

/**
 * AppContent Component
 * 
 * Renders the main application content.
 * - Shows loading screen while checking authentication
 * - Shows Login page if user is not authenticated
 * - Shows main app (Calculator + Settings) if user is authenticated
 * 
 * @component
 * @returns {React.ReactElement} The main app content or login page
 */
function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="app">
        <div className="loading-screen">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <ConfigProvider>
      <div className="app">
        <Header />

        <main className="app-main">
          <div className="container">
            <Calculator />
            <Settings />
          </div>
        </main>

        <footer className="app-footer">
          <p>&copy; 2024 Price Breaker. Calculate your making charges easily.</p>
        </footer>
      </div>
    </ConfigProvider>
  );
}

/**
 * App Component
 * 
 * Root component of the application.
 * Provides AuthProvider context to the entire app.
 * All authentication state is accessible through useAuth() hook.
 * 
 * @component
 * @returns {React.ReactElement} The wrapped app content with auth provider
 */
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

export default App;
