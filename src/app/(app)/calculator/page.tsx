// src/app/(app)/calculator/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CalculatorInstance } from "@/components/calculator/calculator-instance";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const MAX_CALCULATORS = 8;

interface CalculatorInfo {
  id: number; // Unique ID for key prop and potentially other uses
}

export default function CalculatorPage() {
  const [calculators, setCalculators] = useState<CalculatorInfo[]>([{ id: Date.now() }]);

  const addCalculator = () => {
    if (calculators.length < MAX_CALCULATORS) {
      setCalculators((prevCalculators) => [
        ...prevCalculators,
        { id: Date.now() + prevCalculators.length }, // Ensure unique ID
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-3xl text-primary">Calculators</CardTitle>
            <CardDescription className="text-lg">
              Use multiple calculators side-by-side. Add up to {MAX_CALCULATORS}.
            </CardDescription>
          </div>
          <Button onClick={addCalculator} disabled={calculators.length >= MAX_CALCULATORS} size="lg">
            <PlusCircle className="mr-2 h-5 w-5" /> Add Calculator
          </Button>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {calculators.map((calc) => (
          <CalculatorInstance key={calc.id} instanceId={calc.id} />
        ))}
      </div>
       {calculators.length === 0 && (
         <div className="flex flex-col items-center justify-center text-center p-10 text-muted-foreground">
           <p className="text-xl">No calculators yet.</p>
           <p>Click "Add Calculator" to get started.</p>
         </div>
       )}
    </div>
  );
}
