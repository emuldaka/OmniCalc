// src/components/advanced-calculator/advanced-calculator-keypad.tsx
"use client";

import { Button } from "@/components/ui/button";
import { scientificCalculatorButtons, AdvancedCalculatorState, AdvancedCalculatorAction } from "@/lib/advanced-calculator-engine";
import { cn } from "@/lib/utils";

interface AdvancedCalculatorKeypadProps {
  onButtonClick: (action: AdvancedCalculatorAction) => void;
  currentState: AdvancedCalculatorState;
}

export function AdvancedCalculatorKeypad({ onButtonClick, currentState }: AdvancedCalculatorKeypadProps) {
  return (
    <div className="grid grid-cols-9 gap-1"> {/* Changed to 9 columns, reduced gap */}
      {scientificCalculatorButtons.map((btnDef, index) => {
        const effectiveLabel = currentState.secondFunctionActive && btnDef.secondLabel ? btnDef.secondLabel : btnDef.label;
        const effectiveAction = currentState.secondFunctionActive && btnDef.secondAction ? btnDef.secondAction : btnDef.action;
        
        let isActive = false;
        if (btnDef.label === "2nd" && currentState.secondFunctionActive) {
            isActive = true;
        }
        // Rad/Deg button text might change based on mode, or just its action.
        // For now, it doesn't visually change label based on mode, but its action does toggle.

        return (
          <Button
            key={btnDef.label + (btnDef.secondLabel || "") + index} // Added index for better key uniqueness with reordering
            variant={btnDef.className && (btnDef.className.includes("bg-primary") || btnDef.className.includes("bg-accent") || btnDef.className.includes("bg-destructive")) ? "default" : "secondary"}
            className={cn(
              "text-xs sm:text-sm h-11 w-full rounded-md shadow-sm focus:ring-2 focus:ring-ring focus:ring-offset-1 p-1", // Adjusted padding and height slightly
              "active:scale-95 transition-transform duration-75",
              btnDef.className,
              isActive && "bg-accent/70 text-accent-foreground ring-2 ring-accent",
              btnDef.colSpan && `col-span-${btnDef.colSpan}`, // Added colSpan support
            )}
            onClick={() => onButtonClick(effectiveAction)}
            aria-label={effectiveLabel}
            title={effectiveLabel === "x^y" ? "Exponent (Power)" : effectiveLabel === "√" ? "Square Root" : effectiveLabel}
          >
            {effectiveLabel}
          </Button>
        );
      })}
    </div>
  );
}
