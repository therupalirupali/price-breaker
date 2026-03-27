import { AuthProvider, useAuth } from './context/AuthContext';
import { ConfigProvider } from './context/ConfigContext';
import { Calculator } from './components/Calculator';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { Header } from './components/Header';
import './App.css';

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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
