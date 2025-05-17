
// src/components/advanced-calculator/visual-function-builder.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Re-using for display
import { cn } from "@/lib/utils";
import { Eraser, Delete } from "lucide-react";

interface VisualFunctionBuilderProps {
  value: string;
  onChange: (value: string) => void;
}

const builderButtons: Array<{ label: string; action: string; type: 'input' | 'operator' | 'function' | 'constant' | 'control'; className?: string, value?: string }> = [
  // Row 1
  { label: "x", action: "x", type: "input", className: "bg-green-200 hover:bg-green-300 text-green-800" },
  { label: "7", action: "7", type: "input" },
  { label: "8", action: "8", type: "input" },
  { label: "9", action: "9", type: "input" },
  { label: " ( ", action: "(", type: "operator", className: "bg-blue-300 hover:bg-blue-400 text-blue-800" },
  { label: " ) ", action: ")", type: "operator", className: "bg-blue-300 hover:bg-blue-400 text-blue-800" },

  // Row 2
  { label: "sin()", action: "sin(", type: "function" },
  { label: "4", action: "4", type: "input" },
  { label: "5", action: "5", type: "input" },
  { label: "6", action: "6", type: "input" },
  { label: " + ", action: " + ", type: "operator", className: "bg-accent hover:bg-accent/90 text-accent-foreground" },
  { label: " - ", action: " - ", type: "operator", className: "bg-accent hover:bg-accent/90 text-accent-foreground" },

  // Row 3
  { label: "cos()", action: "cos(", type: "function" },
  { label: "1", action: "1", type: "input" },
  { label: "2", action: "2", type: "input" },
  { label: "3", action: "3", type: "input" },
  { label: " * ", action: " * ", type: "operator", className: "bg-accent hover:bg-accent/90 text-accent-foreground" },
  { label: " / ", action: " / ", type: "operator", className: "bg-accent hover:bg-accent/90 text-accent-foreground" },
  
  // Row 4
  { label: "tan()", action: "tan(", type: "function" },
  { label: "0", action: "0", type: "input" },
  { label: ".", action: ".", type: "input" },
  { label: "^", action: "^", type: "operator", value: "**", className: "bg-accent hover:bg-accent/90 text-accent-foreground" }, // Display ^, insert **
  { label: "√()", action: "sqrt(", type: "function" },
  { label: "e", action: "e", type: "constant" },

  // Row 5
  { label: "log()", action: "log(", type: "function" },
  { label: "ln()", action: "ln(", type: "function" },
  { label: "abs()", action: "abs(", type: "function" },
  { label: "π", action: "pi", type: "constant" },
  { icon: Delete, label: "Del", action: "backspace", type: "control", className: "bg-orange-400 hover:bg-orange-500 text-white" },
  { icon: Eraser, label: "Clr", action: "clear", type: "control", className: "bg-red-500 hover:bg-red-600 text-white" },
];


export function VisualFunctionBuilder({ value, onChange }: VisualFunctionBuilderProps) {
  
  const handleButtonClick = (action: string, type: string, buttonValue?: string) => {
    if (type === 'control') {
      if (action === 'clear') {
        onChange("");
      } else if (action === 'backspace') {
        onChange(value.slice(0, -1));
      }
    } else {
      // For '^', use its 'value' (**), otherwise use 'action'
      const toAppend = (action === "^" && buttonValue) ? buttonValue : action;
      onChange(value + toAppend);
    }
  };

  return (
    <div className="space-y-2">
      <Input
        type="text"
        value={value}
        readOnly // Display only, interaction via buttons
        placeholder="Build your function here e.g. x**2 + sin(x)"
        className="text-lg h-12 text-right font-mono bg-muted/30"
        aria-label="Visually built function"
      />
      <div className="grid grid-cols-6 gap-1">
        {builderButtons.map((btn, index) => (
          <Button
            key={btn.label + index}
            variant={btn.className && (btn.className.includes("bg-primary") || btn.className.includes("bg-accent") || btn.className.includes("bg-destructive") || btn.className.includes("bg-green") || btn.className.includes("bg-blue") || btn.className.includes("bg-orange") || btn.className.includes("bg-red")) ? "default" : "secondary"}
            className={cn(
              "text-xs sm:text-sm h-10 w-full rounded-md shadow-sm p-1",
              "active:scale-95 transition-transform duration-75",
               btn.className
            )}
            onClick={() => handleButtonClick(btn.action, btn.type, btn.value)}
            aria-label={btn.label}
            title={btn.label}
          >
            {btn.icon ? <btn.icon className="h-4 w-4" /> : btn.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
