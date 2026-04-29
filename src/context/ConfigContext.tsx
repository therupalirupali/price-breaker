/**
 * @fileoverview Configuration Context
 * 
 * Manages application configuration state (metal price, GST percentage).
 * Persists configuration to localStorage for session persistence.
 * 
 * @module context/ConfigContext
 */

import React, { createContext, useState, useContext, ReactNode } from 'react';

/**
 * Application configuration object
 * @interface Config
 * @property {number} currentMetalPrice - Current metal price per unit (in currency)
 * @property {number} gstPercentage - GST percentage to apply (0-100)
 */
export interface Config {
  currentMetalPrice: number;
  gstPercentage: number;
}

/**
 * Type definition for config context
 * @interface ConfigContextType
 * @property {Config} config - Current configuration object
 * @property {Function} updateConfig - Function to update configuration
 */
interface ConfigContextType {
  config: Config;
  updateConfig: (newConfig: Partial<Config>) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

/**
 * ConfigProvider Component
 * 
 * Provides configuration context to child components.
 * Automatically loads and persists configuration to localStorage.
 * 
 * Default values:
 * - currentMetalPrice: 5000
 * - gstPercentage: 18
 * 
 * Usage:
 * ```jsx
 * <ConfigProvider>
 *   <App />
 * </ConfigProvider>
 * ```
 * 
 * @component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 * @returns {React.ReactElement} Context provider wrapper
 */
export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Config>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('priceBreakerConfig');
    return saved ? JSON.parse(saved) : { currentMetalPrice: 5000, gstPercentage: 18 };
  });

  const updateConfig = (newConfig: Partial<Config>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      localStorage.setItem('priceBreakerConfig', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

/**
 * Hook to access configuration context
 * 
 * Must be used within a ConfigProvider context.
 * Provides access to configuration state and update function.
 * 
 * Example:
 * ```typescript
 * const { config, updateConfig } = useConfig();
 * ```
 * 
 * @hook
 * @returns {ConfigContextType} Configuration context value
 * @throws {Error} If used outside of ConfigProvider
 */
export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
