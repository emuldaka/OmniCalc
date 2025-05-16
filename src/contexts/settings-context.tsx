// src/contexts/settings-context.tsx
"use client";
import type React from 'react';
import { createContext, useContext, useState, useMemo, useCallback } from 'react';

interface SettingsContextType {
  precision: number;
  setPrecision: (precision: number) => void;
  formatNumber: (num: number | string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [precision, setPrecisionState] = useState(2); // Default precision

  const setPrecision = useCallback((newPrecision: number) => {
    if (newPrecision >= 0 && newPrecision <= 20) { // Max 20 decimal places
      setPrecisionState(newPrecision);
    }
  }, []);

  const formatNumber = useCallback((num: number | string) => {
    const numberValue = typeof num === 'string' ? parseFloat(num) : num;
    
    if (Number.isNaN(numberValue)) {
      return "Error: Not a number";
    }
    if (!Number.isFinite(numberValue)) {
      return "Error: Infinite";
    }
    
    // Use toLocaleString for better formatting options, including thousands separators
    // and respecting the set precision.
    try {
      return numberValue.toLocaleString(undefined, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      });
    } catch (e) {
      // Fallback for very large/small numbers that toLocaleString might struggle with
      return numberValue.toFixed(precision);
    }
  }, [precision]);
  
  const value = useMemo(() => ({ precision, setPrecision, formatNumber }), [precision, setPrecision, formatNumber]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
