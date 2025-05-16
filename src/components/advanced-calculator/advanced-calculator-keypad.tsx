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
    <div className="grid grid-cols-6 gap-1.5"> {/* Adjusted grid to 6 columns for more buttons */}
      {scientificCalculatorButtons.map((btnDef) => {
        const effectiveLabel = currentState.secondFunctionActive && btnDef.secondLabel ? btnDef.secondLabel : btnDef.label;
        const effectiveAction = currentState.secondFunctionActive && btnDef.secondAction ? btnDef.secondAction : btnDef.action;
        
        // Determine if button should appear "active" for toggle states
        let isActive = false;
        if (btnDef.label === "2nd" && currentState.secondFunctionActive) {
            isActive = true;
        } else if (btnDef.label === "Rad/Deg" && ((currentState.isRadians && effectiveLabel === "Rad") || (!currentState.isRadians && effectiveLabel === "Deg"))) {
            // This logic might need refinement if Rad/Deg text changes based on 2nd
            // For now, assume Rad/Deg button itself might show active state if its primary function reflects current mode
        }


        return (
          <Button
            key={btnDef.label + (btnDef.secondLabel || "")}
            variant={btnDef.className && (btnDef.className.includes("bg-primary") || btnDef.className.includes("bg-accent") || btnDef.className.includes("bg-destructive")) ? "default" : "secondary"}
            className={cn(
              "text-sm h-12 w-full rounded-md shadow-sm focus:ring-2 focus:ring-ring focus:ring-offset-1", // Adjusted size
              "active:scale-95 transition-transform duration-75",
              btnDef.className,
              isActive && "bg-accent/70 text-accent-foreground ring-2 ring-accent",
              btnDef.label === '(' && 'justify-self-end', // Example for specific button styling
              btnDef.label === ')' && 'justify-self-start',
            )}
            onClick={() => onButtonClick(effectiveAction)}
            aria-label={effectiveLabel}
            title={effectiveLabel === "x^y" ? "Exponent" : effectiveLabel}
          >
            {effectiveLabel}
          </Button>
        );
      })}
    </div>
  );
}
