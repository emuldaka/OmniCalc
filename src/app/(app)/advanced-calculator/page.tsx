// src/app/(app)/advanced-calculator/page.tsx
"use client";

import { useState, useReducer } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BeakerIcon } from "lucide-react";
import { advancedCalculatorReducer, initialState as initialEngineState, AdvancedCalculatorAction } from "@/lib/advanced-calculator-engine";
import { AdvancedCalculatorInstance } from "@/components/advanced-calculator/advanced-calculator-instance"; // Import the new component

export interface StoredValue {
  id: string;
  value: number;
  label: string;
}

export default function AdvancedCalculatorPage() {
  // State for Calculator 1
  const [engineState1, dispatch1] = useReducer(advancedCalculatorReducer, initialEngineState);
  const [storedValues1, setStoredValues1] = useState<StoredValue[]>([]);
  const [directInputValue1, setDirectInputValue1] = useState<string>("");

  // State for Calculator 2
  const [engineState2, dispatch2] = useReducer(advancedCalculatorReducer, initialEngineState);
  const [storedValues2, setStoredValues2] = useState<StoredValue[]>([]);
  const [directInputValue2, setDirectInputValue2] = useState<string>("");

  return (
    <div className="flex flex-col h-full space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-primary flex items-center justify-center">
            <BeakerIcon className="mr-3 h-8 w-8" /> Advanced Scientific Calculators
          </CardTitle>
          <CardDescription className="text-lg">
            Perform complex calculations and manage numeric values with two independent calculators.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6"> {/* Increased gap-y for better spacing between rows on mobile */}
        <AdvancedCalculatorInstance
          instanceNumber={1}
          engineState={engineState1}
          engineDispatch={dispatch1}
          storedValues={storedValues1}
          setStoredValues={setStoredValues1}
          directInputValue={directInputValue1}
          setDirectInputValue={setDirectInputValue1}
        />
        <AdvancedCalculatorInstance
          instanceNumber={2}
          engineState={engineState2}
          engineDispatch={dispatch2}
          storedValues={storedValues2}
          setStoredValues={setStoredValues2}
          directInputValue={directInputValue2}
          setDirectInputValue={setDirectInputValue2}
        />
      </div>
    </div>
  );
}
