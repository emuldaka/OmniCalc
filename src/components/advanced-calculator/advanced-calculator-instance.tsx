// src/components/advanced-calculator/advanced-calculator-instance.tsx
"use client";

import { useCallback } from "react";
import type { Dispatch } from 'react';
import { AdvancedCalculatorLayout } from "@/components/advanced-calculator/advanced-calculator-layout";
import { StoredValuesContainer } from "@/components/advanced-calculator/stored-values-container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, ListChecks } from "lucide-react";
import type { AdvancedCalculatorState, AdvancedCalculatorAction } from "@/lib/advanced-calculator-engine";
import type { StoredValue } from "@/app/(app)/advanced-calculator/page";

interface AdvancedCalculatorInstanceProps {
  instanceNumber: number;
  engineState: AdvancedCalculatorState;
  engineDispatch: Dispatch<AdvancedCalculatorAction>;
  storedValues: StoredValue[];
  setStoredValues: Dispatch<React.SetStateAction<StoredValue[]>>;
  directInputValue: string;
  setDirectInputValue: Dispatch<React.SetStateAction<string>>;
}

export function AdvancedCalculatorInstance({
  instanceNumber,
  engineState,
  engineDispatch,
  storedValues,
  setStoredValues,
  directInputValue,
  setDirectInputValue,
}: AdvancedCalculatorInstanceProps) {

  const handleStoreResultFromCalculator = useCallback((result: string) => {
    const numericResult = parseFloat(result);
    if (!isNaN(numericResult) && isFinite(numericResult)) {
      setStoredValues((prev) => [
        ...prev,
        {
          id: `calc-${instanceNumber}-${Date.now()}`,
          value: numericResult,
          label: `Calc #${instanceNumber}: ${numericResult.toFixed(2)}`,
        },
      ]);
    }
  }, [setStoredValues, instanceNumber]);

  const handleAddDirectValue = useCallback(() => {
    const numericValue = parseFloat(directInputValue);
    if (!isNaN(numericValue) && isFinite(numericValue)) {
      setStoredValues((prev) => [
        ...prev,
        {
          id: `direct-${instanceNumber}-${Date.now()}`,
          value: numericValue,
          label: `Direct #${instanceNumber}: ${numericValue.toFixed(2)}`,
        },
      ]);
      setDirectInputValue("");
    }
  }, [directInputValue, setStoredValues, setDirectInputValue, instanceNumber]);

  const handleDeleteValue = useCallback((id: string) => {
    setStoredValues((prev) => prev.filter((val) => val.id !== id));
  }, [setStoredValues]);

  return (
    <div className="flex flex-col space-y-4">
      <AdvancedCalculatorLayout
        engineState={engineState}
        engineDispatch={engineDispatch}
        onStoreResult={handleStoreResultFromCalculator}
      />
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-primary flex items-center">
            <PlusCircle className="mr-2 h-5 w-5"/> Add Value to Storage (Calc #{instanceNumber})
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            type="number"
            value={directInputValue}
            onChange={(e) => setDirectInputValue(e.target.value)}
            placeholder="Enter a number"
            className="flex-grow"
            aria-label={`Direct input for calculator ${instanceNumber}`}
          />
          <Button onClick={handleAddDirectValue}>Add Value</Button>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-primary flex items-center">
            <ListChecks className="mr-3 h-6 w-6" /> Stored Values (Calc #{instanceNumber})
          </CardTitle>
          <CardDescription>
            Saved numeric values for this calculator.
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
  );
}
