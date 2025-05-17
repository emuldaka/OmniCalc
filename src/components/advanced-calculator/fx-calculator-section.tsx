
// src/components/advanced-calculator/fx-calculator-section.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FunctionSquare, PlusCircle, TextIcon, CalculatorIcon } from "lucide-react";
import { VisualFunctionBuilder } from "./visual-function-builder";

interface FxCalculatorSectionProps {
  onAddEquation: (equationString: string) => void;
}

export function FxCalculatorSection({ onAddEquation }: FxCalculatorSectionProps) {
  const [inputMode, setInputMode] = useState<'text' | 'visual'>('text'); // 'text' or 'visual'
  const [textEquationInput, setTextEquationInput] = useState<string>("");
  const [visualEquationInput, setVisualEquationInput] = useState<string>("");

  const handleAddClick = () => {
    const equationToAdd = inputMode === 'text' ? textEquationInput : visualEquationInput;
    if (equationToAdd.trim()) {
      onAddEquation(equationToAdd);
      if (inputMode === 'text') {
        setTextEquationInput("");
      } else {
        setVisualEquationInput("");
      }
    }
  };

  const toggleInputMode = () => {
    setInputMode(prevMode => prevMode === 'text' ? 'visual' : 'text');
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl text-primary flex items-center">
            <FunctionSquare className="mr-3 h-7 w-7" /> f(x) Equation Definer
          </CardTitle>
          <Button variant="outline" onClick={toggleInputMode} size="sm">
            {inputMode === 'text' ? <CalculatorIcon className="mr-2 h-4 w-4" /> : <TextIcon className="mr-2 h-4 w-4" />}
            Switch to {inputMode === 'text' ? 'Visual Builder' : 'Text Input'}
          </Button>
        </div>
        <CardDescription>
          Enter an equation in terms of 'x'. You can use prefixes like "f(x) =" or "y =".
          Example: "f(x) = x**2 - 5*x + 3" or "sin(x) + cos(x)".
          Use '**' for exponentiation (e.g., "x**3" for x cubed).
          Functions like sin(x), cos(x), tan(x), log(x), ln(x), sqrt(x), abs(x), e^(x) are supported.
          Constants: pi, e.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {inputMode === 'text' ? (
          <div className="flex gap-2">
            <Input
              type="text"
              value={textEquationInput}
              onChange={(e) => setTextEquationInput(e.target.value)}
              placeholder="e.g., f(x) = sin(x) + 0.5*cos(2*x)"
              className="flex-grow"
            />
          </div>
        ) : (
          <VisualFunctionBuilder
            value={visualEquationInput}
            onChange={setVisualEquationInput}
          />
        )}
        <Button onClick={handleAddClick} aria-label="Add equation to storage" className="w-full">
          <PlusCircle className="mr-2 h-5 w-5"/> Add Equation to Stored List
        </Button>
         <p className="text-xs text-muted-foreground text-center">
          Ensure your equation is valid. The grapher will attempt to parse it.
        </p>
      </CardContent>
    </Card>
  );
}
