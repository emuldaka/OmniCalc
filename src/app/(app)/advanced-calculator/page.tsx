// src/app/(app)/advanced-calculator/page.tsx
"use client";

import { useState, useCallback } from "react";
import { AdvancedCalculatorLayout } from "@/components/advanced-calculator/advanced-calculator-layout";
import { GraphingSection } from "@/components/advanced-calculator/graphing-section";
import { StoredValuesContainer } from "@/components/advanced-calculator/stored-values-container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, BarChartHorizontalBig, ListChecks } from "lucide-react";

export interface StoredValue {
  id: string;
  value: number;
  label: string;
  plotted: boolean;
}

export type GraphDataPoint = {
  name: string; // Typically the label or id
  value: number;
  // Recharts might need x/y if not implicitly handled by type (e.g. for scatter)
  // For a simple scatter where x is index, 'value' can be y.
};


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
          plotted: false,
        },
      ]);
    } else {
      // Optionally, show a toast error if the result isn't a valid number
      console.warn("Attempted to store invalid calculator result:", result);
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
          plotted: false,
        },
      ]);
      setDirectInputValue("");
    } else {
      // Optionally, show a toast error
       console.warn("Attempted to store invalid direct input:", directInputValue);
    }
  }, [directInputValue]);

  const handleTogglePlot = useCallback((id: string) => {
    setStoredValues((prev) =>
      prev.map((val) =>
        val.id === id ? { ...val, plotted: !val.plotted } : val
      )
    );
  }, []);

  const handleDeleteValue = useCallback((id: string) => {
    setStoredValues((prev) => prev.filter((val) => val.id !== id));
  }, []);

  const handleClearPlots = useCallback(() => {
    setStoredValues((prev) => prev.map((val) => ({ ...val, plotted: false })));
  }, []);

  const graphData: GraphDataPoint[] = storedValues
    .filter((sv) => sv.plotted)
    .map((sv, index) => ({
      name: sv.label || `P${index + 1}`, // Use label or a default point name
      value: sv.value,
      // x: index, // explicit x for scatter if needed, otherwise recharts might infer for line/bar
      // y: sv.value,
    }));

  return (
    <div className="flex flex-col h-full space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-primary flex items-center justify-center">
            <BarChartHorizontalBig className="mr-3 h-8 w-8" /> Advanced Scientific Calculator & Grapher
          </CardTitle>
          <CardDescription className="text-lg">
            Perform complex calculations, store values, and plot them on a graph.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Calculator and its 'Add to Storage' button */}
        <div className="flex flex-col space-y-4">
           <AdvancedCalculatorLayout onStoreResult={handleStoreResultFromCalculator} />
        </div>

        {/* Column 2: Graphing Section and direct input for stored values */}
        <div className="flex flex-col space-y-4">
          <GraphingSection data={graphData} onClearPlots={handleClearPlots} />
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-primary flex items-center">
                <PlusCircle className="mr-2 h-5 w-5"/> Add Value to Storage
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
        </div>
      </div>

      {/* Stored Values Container - spans below */}
      <div className="mt-6">
         <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center">
                <ListChecks className="mr-3 h-7 w-7" /> Stored Values
              </CardTitle>
              <CardDescription>
                Manage your stored values. Check to plot them on the graph.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <StoredValuesContainer
                    values={storedValues}
                    onTogglePlot={handleTogglePlot}
                    onDeleteValue={handleDeleteValue}
                />
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
