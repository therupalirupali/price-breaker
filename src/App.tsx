import { ConfigProvider } from './context/ConfigContext';
import { Calculator } from './components/Calculator';
import { Settings } from './components/Settings';
import './App.css';

function App() {
  return (
    <ConfigProvider>
      <div className="app">
        <header className="app-header">
          <h1>💎 Price Breaker</h1>
          <p>Metal Making Charge Calculator</p>
        </header>

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

export default App;
