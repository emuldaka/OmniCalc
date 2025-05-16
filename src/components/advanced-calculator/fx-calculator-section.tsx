
// src/components/advanced-calculator/fx-calculator-section.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FunctionSquare, PlusCircle } from "lucide-react";

interface FxCalculatorSectionProps {
  onAddEquation: (equationString: string) => void;
}

export function FxCalculatorSection({ onAddEquation }: FxCalculatorSectionProps) {
  const [equationInput, setEquationInput] = useState<string>("");

  const handleAddClick = () => {
    if (equationInput.trim()) {
      onAddEquation(equationInput);
      setEquationInput(""); // Clear input after adding
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center">
          <FunctionSquare className="mr-3 h-7 w-7" /> f(x) Equation Definer
        </CardTitle>
        <CardDescription>
          Enter an equation in terms of 'x'. You can use prefixes like "f(x) =" or "y =".
          Example: "f(x) = x**2 - 5*x + 3" or "sin(x) + cos(x)".
          Use '**' for exponentiation (e.g., "x**3" for x cubed).
          Functions like sin(x), cos(x), tan(x), log(x), ln(x), sqrt(x), abs(x), e^(x) are supported.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="text"
            value={equationInput}
            onChange={(e) => setEquationInput(e.target.value)}
            placeholder="e.g., f(x) = sin(x) + 0.5*cos(2*x)"
            className="flex-grow"
          />
          <Button onClick={handleAddClick} aria-label="Add equation to storage">
            <PlusCircle className="mr-2 h-5 w-5"/> Add Equation
          </Button>
        </div>
         <p className="text-xs text-muted-foreground">
          Use 'x' as the variable. Standard operators: +, -, *, /, ** (power). 
          Implicit multiplication (e.g., "2x") is supported. Constants: pi, e.
        </p>
      </CardContent>
    </Card>
  );
}
