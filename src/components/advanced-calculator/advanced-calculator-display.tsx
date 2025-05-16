// src/components/advanced-calculator/advanced-calculator-display.tsx

interface AdvancedCalculatorDisplayProps {
  displayValue: string;
  expression: string;
  isRadians: boolean;
  secondFunctionActive: boolean;
  error: string | null;
}

export function AdvancedCalculatorDisplay({
  displayValue,
  expression,
  isRadians,
  secondFunctionActive,
  error,
}: AdvancedCalculatorDisplayProps) {
  return (
    <div className="bg-muted/50 p-4 rounded-lg shadow-inner mb-4 space-y-2">
      <div className="text-xs text-muted-foreground h-6 truncate flex justify-between items-center px-1">
        <span>{isRadians ? "RAD" : "DEG"}</span>
        {secondFunctionActive && <span className="font-semibold text-accent">2nd</span>}
      </div>
      <div 
        className="text-muted-foreground text-sm h-8 truncate text-right px-1" 
        title={expression}
      >
        {error ? "" : expression}
      </div>
      <div
        className="text-foreground text-3xl font-mono font-bold h-16 flex items-center justify-end truncate p-2 text-right bg-background/30 rounded"
        title={error || displayValue}
        aria-live="polite"
      >
        {error || displayValue}
      </div>
    </div>
  );
}
