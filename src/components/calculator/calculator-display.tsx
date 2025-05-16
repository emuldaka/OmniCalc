// src/components/calculator/calculator-display.tsx
"use client";

import { useSettings } from "@/contexts/settings-context";

interface CalculatorDisplayProps {
  mainDisplay: string;
  secondaryDisplay?: string; // For showing previous operand and operator, or full expression
}

export function CalculatorDisplay({ mainDisplay, secondaryDisplay }: CalculatorDisplayProps) {
  const { formatNumber } = useSettings();
  
  // Attempt to format if mainDisplay is a number, otherwise show as is (e.g. "Error")
  const formattedMainDisplay = !isNaN(parseFloat(mainDisplay)) && isFinite(Number(mainDisplay))
    ? formatNumber(parseFloat(mainDisplay))
    : mainDisplay;

  return (
    <div className="bg-muted/50 p-6 rounded-lg text-right shadow-inner mb-4">
      {secondaryDisplay && (
        <div className="text-muted-foreground text-xl h-8 truncate" title={secondaryDisplay}>
          {secondaryDisplay}
        </div>
      )}
      <div 
        className="text-foreground text-4xl font-mono font-bold h-20 truncate"
        title={formattedMainDisplay}
        aria-live="polite"
      >
        {formattedMainDisplay}
      </div>
    </div>
  );
}
