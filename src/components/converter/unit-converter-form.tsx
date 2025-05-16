
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
  const getInitialInputValue = (catId: string) => {
    return catId === 'timezone' ? "12:00" : "1";
  };

  const [inputValue, setInputValue] = useState<string>(getInitialInputValue(category.id));
  const [fromUnit, setFromUnit] = useState<string>(category.units[0]?.id || "");
  const [toUnit, setToUnit] = useState<string>(category.units[1]?.id || category.units[0]?.id || "");
  const [outputValue, setOutputValue] = useState<string>("");
  const { formatNumber } = useSettings();

  const performConversion = useCallback(() => {
    if (!fromUnit || !toUnit) {
        setOutputValue("Select units");
        return;
    }
    // Input value is always a string. The conversion function for the category handles parsing.
    const result = convertUnits(inputValue, fromUnit, toUnit, category.id);
    
    if (category.id === 'timezone') {
        // Timezone conversion returns a string "HH:MM" or an error message string
        setOutputValue(result as string); 
    } else if (typeof result === 'number') {
      setOutputValue(formatNumber(result));
    } else {
      // This handles error strings from numeric conversions (e.g., "Invalid input")
      setOutputValue(result); 
    }
  }, [inputValue, fromUnit, toUnit, category.id, formatNumber]);

  useEffect(() => {
    performConversion();
  }, [performConversion]);
  
  // Reset units when category changes
  useEffect(() => {
    setFromUnit(category.units[0]?.id || "");
    setToUnit(category.units[1]?.id || category.units[0]?.id || "");
    setInputValue(getInitialInputValue(category.id));
  }, [category]);


  const handleSwapUnits = () => {
    const currentFrom = fromUnit;
    setFromUnit(toUnit);
    setToUnit(currentFrom);
  };
  
  const handleReset = () => {
    setInputValue(getInitialInputValue(category.id));
    setFromUnit(category.units[0]?.id || "");
    setToUnit(category.units[1]?.id || category.units[0]?.id || "");
  };

  const handleAiConverterResult = (result: string | number, expression: string) => {
    if (typeof result === 'number') {
      setOutputValue(formatNumber(result));
      const match = expression.match(/^(\d+(\.\d+)?)/);
      if (match && match[1]) {
        setInputValue(match[1]);
      }
    } else { // result is an error string
      setOutputValue(result);
    }
  };
  
  useEffect(() => {
    if (onAiResult) {
      // This mechanism needs refinement for AI to target converter fields.
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
              type={category.id === 'timezone' ? "time" : "text"} // Use "text" for general numeric to allow flexible input before parseFloat
              inputMode={category.id === 'timezone' ? undefined : "decimal"}
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

  