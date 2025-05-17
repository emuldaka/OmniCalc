
// src/app/(app)/advanced-calculator/page.tsx
"use client";

import { useState, useCallback } from "react";
import { AdvancedCalculatorLayout } from "@/components/advanced-calculator/advanced-calculator-layout";
import { StoredValuesContainer } from "@/components/advanced-calculator/stored-values-container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, ListChecks, BeakerIcon } from "lucide-react";

export interface StoredValue {
  id: string;
  value: number;
  label: string;
}

export default function AdvancedCalculatorPage() {
  const [storedValues, setStoredValues] = useState<StoredValue[]>([]);
  const [directInputValue, setDirectInputValue] = useState<string>("");

  const handleStoreResultFromCalculator = useCallback((result: string) => {
    const numericResult = parseFloat(result);
    if (!isNaN(numericResult) && isFinite(numericResult)) {
      setStoredValues((prev) => [
        ...prev,
        {
          id: `calc-${Date.now()}`,
          value: numericResult,
          label: `Calc: ${numericResult.toFixed(2)}`,
        },
      ]);
    }
  }, []);

  const handleAddDirectValue = useCallback(() => {
    const numericValue = parseFloat(directInputValue);
    if (!isNaN(numericValue) && isFinite(numericValue)) {
      setStoredValues((prev) => [
        ...prev,
        {
          id: `direct-${Date.now()}`,
          value: numericValue,
          label: `Direct: ${numericValue.toFixed(2)}`,
        },
      ]);
      setDirectInputValue("");
    }
  }, [directInputValue]);

  const handleDeleteValue = useCallback((id: string) => {
    setStoredValues((prev) => prev.filter((val) => val.id !== id));
  }, []);

  return (
    <div className="flex flex-col h-full space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-primary flex items-center justify-center">
            <BeakerIcon className="mr-3 h-8 w-8" /> Advanced Scientific Calculator
          </CardTitle>
          <CardDescription className="text-lg">
            Perform complex calculations and manage numeric values.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex flex-col space-y-4 items-center"> {/* Centering the single column content */}
        <div className="w-full max-w-3xl"> {/* Max width for calculator layout */}
            <AdvancedCalculatorLayout onStoreResult={handleStoreResultFromCalculator} />
        </div>
        <Card className="shadow-md w-full max-w-3xl"> {/* Max width for consistency */}
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center">
              <PlusCircle className="mr-2 h-5 w-5"/> Add Numeric Value to Storage
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input
              type="number"
              value={directInputValue}
              onChange={(e) => setDirectInputValue(e.target.value)}
              placeholder="Enter a number"
              className="flex-grow"
            />
            <Button onClick={handleAddDirectValue}>Add Value</Button>
          </CardContent>
        </Card>
         <Card className="shadow-md w-full max-w-3xl"> {/* Max width for consistency */}
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center">
              <ListChecks className="mr-3 h-6 w-6" /> Stored Numeric Values
            </CardTitle>
            <CardDescription>
              Your saved numeric values for reference.
            </CardDescription>
          </CardHeader>
          <CardContent>
              <StoredValuesContainer
                  values={storedValues}
                  onDeleteValue={handleDeleteValue}
              />
          </CardContent>
       </Card>
      </div>
    </div>
  );
}
