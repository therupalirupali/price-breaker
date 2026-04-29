/**
 * @fileoverview Making Charge Calculator Component
 * 
 * Calculates making charges based on:
 * - Final price (user input)
 * - Current metal price (from settings)
 * - GST percentage (from settings)
 * 
 * @module components/Calculator
 */

import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import './Calculator.css';

/**
 * Calculator Component
 * 
 * Allows users to calculate making charges by entering a final price.
 * Uses the formula:
 * ```
 * Making Charge = (Final Price / (1 + GST%)) - Metal Price
 * ```
 * 
 * Features:
 * - Input validation for final price
 * - Real-time calculation
 * - Detailed breakdown of calculation components
 * - Reset functionality
 * 
 * Dependencies:
 * - ConfigContext for metal price and GST settings
 * 
 * @component
 * @returns {React.ReactElement} Calculator UI with input, button, and results
 */
export const Calculator: React.FC = () => {
  const { config } = useConfig();
  const [finalPrice, setFinalPrice] = useState<number | ''>('');
  const [makingCharge, setMakingCharge] = useState<number | null>(null);
  const [details, setDetails] = useState<any>(null);

  /**
   * Calculates the making charge based on final price and configuration
   * 
   * Formula Breakdown:
   * ```
   * Final Price = (Metal Price + Making Charge) × (1 + GST%)
   * 
   * Rearranged:
   * Metal Price + Making Charge = Final Price / (1 + GST%)
   * Making Charge = (Final Price / (1 + GST%)) - Metal Price
   * GST Amount = (Metal Price + Making Charge) × (GST% / 100)
   * ```
   * 
   * @function
   * @returns {void} Updates state with calculated values
   */
  const handleCalculate = () => {
    if (!finalPrice || finalPrice <= 0) {
      alert('Please enter a valid final price');
      return;
    }

    // Calculate making charge
    // Final Price = (Metal Price + Making Charge) + GST on (Metal Price + Making Charge)
    // Let x = Metal Price + Making Charge
    // Final Price = x + (x * GST/100)
    // Final Price = x * (1 + GST/100)
    // x = Final Price / (1 + GST/100)

    const gstFactor = 1 + config.gstPercentage / 100;
    const metalPlusMaking = finalPrice / gstFactor;
    const calculatedMakingCharge = metalPlusMaking - config.currentMetalPrice;

    const gstAmount = metalPlusMaking * (config.gstPercentage / 100);

    setMakingCharge(calculatedMakingCharge);
    setDetails({
      metalPrice: config.currentMetalPrice,
      makingCharge: calculatedMakingCharge,
      metalPlusMaking: metalPlusMaking,
      gstPercentage: config.gstPercentage,
      gstAmount: gstAmount,
      finalPrice: finalPrice,
    });
  };

  /**
   * Resets the calculator to initial state
   * Clears all input fields and calculation results
   * 
   * @function
   * @returns {void} Clears all calculator state
   */
  const handleReset = () => {
    setFinalPrice('');
    setMakingCharge(null);
    setDetails(null);
  };

  return (
    <div className="calculator">
      <h2>Making Charge Calculator</h2>
      
      <div className="input-group">
        <label htmlFor="finalPrice">Final Price (₹):</label>
        <input
          id="finalPrice"
          type="number"
          value={finalPrice}
          onChange={(e) => setFinalPrice(e.target.value ? parseFloat(e.target.value) : '')}
          placeholder="Enter final price"
          step="0.01"
        />
      </div>

      <div className="current-config">
        <p><strong>Current Configuration:</strong></p>
        <p>Metal Price: ₹{config.currentMetalPrice.toFixed(2)}</p>
        <p>GST: {config.gstPercentage}%</p>
      </div>

      <div className="button-group">
        <button onClick={handleCalculate} className="btn-primary">
          Calculate Making Charge
        </button>
        <button onClick={handleReset} className="btn-secondary">
          Reset
        </button>
      </div>

      {makingCharge !== null && details && (
        <div className="results">
          <h3>Calculation Results</h3>
          <table className="results-table">
            <tbody>
              <tr>
                <td><strong>Metal Price:</strong></td>
                <td>₹{details.metalPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Making Charge:</strong></td>
                <td className="highlight">₹{details.makingCharge.toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Metal + Making:</strong></td>
                <td>₹{details.metalPlusMaking.toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>GST ({details.gstPercentage}%):</strong></td>
                <td>₹{details.gstAmount.toFixed(2)}</td>
              </tr>
              <tr className="total-row">
                <td><strong>Final Price:</strong></td>
                <td>₹{details.finalPrice.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div className="summary">
            <p>
              Based on a final price of <strong>₹{details.finalPrice.toFixed(2)}</strong>,
              the <strong>making charge is ₹{details.makingCharge.toFixed(2)}</strong>.
            </p>
            <p className="percentage">
              This is <strong>{((details.makingCharge / details.metalPrice) * 100).toFixed(2)}%</strong> of the metal price.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
