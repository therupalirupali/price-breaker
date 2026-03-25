import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import './Settings.css';

export const Settings: React.FC = () => {
  const { config, updateConfig } = useConfig();
  const [metalPrice, setMetalPrice] = useState<string>(config.currentMetalPrice.toString());
  const [gstPercentage, setGstPercentage] = useState<string>(config.gstPercentage.toString());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const metalValue = parseFloat(metalPrice);
    const gstValue = parseFloat(gstPercentage);

    if (isNaN(metalValue) || metalValue <= 0) {
      alert('Please enter a valid metal price');
      return;
    }

    if (isNaN(gstValue) || gstValue < 0 || gstValue > 100) {
      alert('Please enter a valid GST percentage (0-100)');
      return;
    }

    updateConfig({
      currentMetalPrice: metalValue,
      gstPercentage: gstValue,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setMetalPrice(config.currentMetalPrice.toString());
    setGstPercentage(config.gstPercentage.toString());
  };

  return (
    <div className="settings">
      <h2>Configuration Settings</h2>

      <div className="setting-group">
        <label htmlFor="metalPrice">Current Metal Price (₹):</label>
        <div className="input-container">
          <input
            id="metalPrice"
            type="number"
            value={metalPrice}
            onChange={(e) => setMetalPrice(e.target.value)}
            placeholder="Enter metal price"
            step="0.01"
            min="0"
          />
          <span className="currency">₹</span>
        </div>
        <p className="help-text">The current market price of the metal (per unit)</p>
      </div>

      <div className="setting-group">
        <label htmlFor="gstPercentage">GST Percentage (%):</label>
        <div className="input-container">
          <input
            id="gstPercentage"
            type="number"
            value={gstPercentage}
            onChange={(e) => setGstPercentage(e.target.value)}
            placeholder="Enter GST percentage"
            step="0.1"
            min="0"
            max="100"
          />
          <span className="percentage">%</span>
        </div>
        <p className="help-text">The GST rate to be applied (default is 18%)</p>
      </div>

      <div className="info-box">
        <h4>Current Settings</h4>
        <p>Metal Price: <strong>₹{config.currentMetalPrice.toFixed(2)}</strong></p>
        <p>GST Rate: <strong>{config.gstPercentage}%</strong></p>
      </div>

      <div className="button-group">
        <button onClick={handleSave} className="btn-save">
          {saved ? '✓ Saved!' : 'Save Configuration'}
        </button>
        <button onClick={handleReset} className="btn-reset">
          Reset
        </button>
      </div>

      {saved && <div className="success-message">Settings updated successfully!</div>}
    </div>
  );
};
