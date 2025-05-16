// src/components/converter/unit-converter-form.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft, RotateCcw } from "lucide-react";
import type { UnitCategory, Unit } from "@/lib/unit-definitions";
import { convertUnits } from "@/lib/unit-definitions";
import { useSettings } from "@/contexts/settings-context";
import { Card, CardContent } from "@/components/ui/card";

interface UnitConverterFormProps {
  category: UnitCategory;
  onAiResult?: (result: string | number, expression: string) => void; // For AI input integration
}

export function UnitConverterForm({ category, onAiResult }: UnitConverterFormProps) {
  const [inputValue, setInputValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>(category.units[0]?.id || "");
  const [toUnit, setToUnit] = useState<string>(category.units[1]?.id || category.units[0]?.id || "");
  const [outputValue, setOutputValue] = useState<string>("");
  const { formatNumber } = useSettings();

  const performConversion = useCallback(() => {
    const numericInput = parseFloat(inputValue);
    if (isNaN(numericInput)) {
      setOutputValue("Invalid input");
      return;
    }
    if (!fromUnit || !toUnit) {
        setOutputValue("Select units");
        return;
    }

    const result = convertUnits(numericInput, fromUnit, toUnit, category.id);
    if (typeof result === 'number') {
      setOutputValue(formatNumber(result));
    } else {
      setOutputValue(result); // Error message string
    }
  }, [inputValue, fromUnit, toUnit, category.id, formatNumber]);

  useEffect(() => {
    performConversion();
  }, [performConversion]);
  
  // Reset units when category changes
  useEffect(() => {
    setFromUnit(category.units[0]?.id || "");
    setToUnit(category.units[1]?.id || category.units[0]?.id || "");
    setInputValue("1"); // Reset input value as well
  }, [category]);


  const handleSwapUnits = () => {
    const currentFrom = fromUnit;
    setFromUnit(toUnit);
    setToUnit(currentFrom);
    // Input value remains, output will recalculate due to useEffect on fromUnit/toUnit
  };
  
  const handleReset = () => {
    setInputValue("1");
    setFromUnit(category.units[0]?.id || "");
    setToUnit(category.units[1]?.id || category.units[0]?.id || "");
    // outputValue will update via useEffect
  };

  // Handler for AI results specific to converter
  // This would be called from a parent if AI input field was part of this component tree
  // Or via global state/context if AI input is in header
  const handleAiConverterResult = (result: string | number, expression: string) => {
    if (typeof result === 'number') {
      // Attempt to set input value, assuming AI gives a raw number
      // This part is tricky as AI might give "10 meters" instead of just "10"
      // For now, if AI gives a number, it's treated as the *result* of a conversion.
      // A more sophisticated AI handler would parse units and values.
      setOutputValue(formatNumber(result));
      // Maybe try to update inputValue if the expression implies an input
      const match = expression.match(/^(\d+(\.\d+)?)/);
      if (match && match[1]) {
        setInputValue(match[1]);
      }
    } else {
      setOutputValue(result); // Error message
    }
    // Potentially update fromUnit and toUnit if AI can provide that info
    // toast({ title: "AI Conversion", description: `${expression} = ${formatNumber(result)}` });
  };
  
  // Link AI handler if provided
  useEffect(() => {
    if (onAiResult) {
      // This mechanism would need refinement for how AI input specifically targets converter fields.
      // Example: onAiResult might need to be invoked by a global AI input handler.
    }
  }, [onAiResult]);


  return (
    <Card className="w-full shadow-lg">
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-end">
          <div className="md:col-span-4 space-y-2">
            <Label htmlFor={`input-value-${category.id}`} className="font-medium text-primary">Value</Label>
            <Input
              id={`input-value-${category.id}`}
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="text-lg p-3"
              aria-label={`Input value for ${category.name}`}
            />
          </div>

          <div className="md:col-span-3 space-y-2">
            <Label htmlFor={`from-unit-${category.id}`} className="font-medium text-primary">From</Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger id={`from-unit-${category.id}`} className="text-lg p-3" aria-label={`Select unit to convert from for ${category.name}`}>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {category.units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id} className="text-lg">
                    {unit.name} ({unit.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-1 flex items-center justify-center pt-7">
            <Button variant="ghost" size="icon" onClick={handleSwapUnits} className="text-primary hover:text-accent" aria-label="Swap units">
              <ArrowRightLeft className="h-6 w-6" />
            </Button>
          </div>

          <div className="md:col-span-3 space-y-2">
            <Label htmlFor={`to-unit-${category.id}`} className="font-medium text-primary">To</Label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger id={`to-unit-${category.id}`} className="text-lg p-3" aria-label={`Select unit to convert to for ${category.name}`}>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {category.units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id} className="text-lg">
                    {unit.name} ({unit.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2 pt-4 border-t border-border">
          <Label className="font-medium text-xl text-primary">Result</Label>
          <div 
            className="bg-muted/50 p-4 rounded-md text-3xl font-semibold text-foreground min-h-[60px] flex items-center"
            aria-live="polite"
          >
            {outputValue}
          </div>
        </div>

        <div className="flex justify-end">
            <Button variant="outline" onClick={handleReset} className="text-primary border-primary hover:bg-primary/10">
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
        </div>

      </CardContent>
    </Card>
  );
}
