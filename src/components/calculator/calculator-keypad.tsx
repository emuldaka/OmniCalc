// src/components/calculator/calculator-keypad.tsx
"use client";

import { Button } from "@/components/ui/button";
import { calculatorButtons } from "@/lib/calculator-engine";
import type { CalculatorState } from "@/lib/calculator-engine"; // Import type
import { cn } from "@/lib/utils";

interface CalculatorKeypadProps {
  onButtonClick: (type: string, value?: string) => void;
  currentState: CalculatorState; // Receive current state for potential dynamic button behavior
}

export function CalculatorKeypad({ onButtonClick, currentState }: CalculatorKeypadProps) {
  return (
    <div className="grid grid-cols-4 gap-1">
      {calculatorButtons.map((btn) => (
        <Button
          key={btn.label}
          variant={btn.className && (btn.className.includes("bg-primary") || btn.className.includes("bg-accent") || btn.className.includes("bg-destructive")) ? "default" : "secondary"}
          className={cn(
            "text-lg h-14 w-full rounded-md shadow-md focus:ring-2 focus:ring-ring focus:ring-offset-1", 
            "active:scale-95 transition-transform duration-75",
            btn.className,
            // Example of dynamic styling based on state:
            // currentState.operation === (btn.value || btn.label) && btn.type === "CHOOSE_OPERATION" && "bg-accent/50 ring-2 ring-accent"
          )}
          onClick={() => onButtonClick(btn.type, btn.value || btn.label)}
          aria-label={btn.label === "×" ? "multiply" : btn.label === "÷" ? "divide" : btn.label}
        >
          {btn.label}
        </Button>
      ))}
    </div>
  );
}
