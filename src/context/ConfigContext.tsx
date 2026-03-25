import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Config {
  currentMetalPrice: number;
  gstPercentage: number;
}

interface ConfigContextType {
  config: Config;
  updateConfig: (newConfig: Partial<Config>) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

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

export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
