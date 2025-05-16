
// src/app/(app)/advanced-calculator/page.tsx
"use client";

import { useState, useCallback, useMemo } from "react";
import { AdvancedCalculatorLayout } from "@/components/advanced-calculator/advanced-calculator-layout";
import { GraphingSection } from "@/components/advanced-calculator/graphing-section";
import { StoredValuesContainer } from "@/components/advanced-calculator/stored-values-container";
import { FxCalculatorSection } from "@/components/advanced-calculator/fx-calculator-section";
import { StoredEquationsContainer } from "@/components/advanced-calculator/stored-equations-container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, BarChartHorizontalBig, ListChecks, FunctionSquare } from "lucide-react";

// For numeric stored values (no longer plotable)
export interface StoredValue {
  id: string;
  value: number;
  label: string;
}

// For stored equations (plotable)
export interface EquationItem {
  id: string;
  equationString: string;
  plotted: boolean;
  color: string; // For graph line color
}

// For data points on the graph (x, y pairs)
export type GraphDataPoint = {
  x: number;
  y: number;
};

// Data structure for a single function line on the graph
export interface FunctionPlotData {
    id: string;
    points: GraphDataPoint[];
    color: string;
    name: string; // e.g., the equation string
}

const lineColors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

// Simple equation evaluation (assumes 'x' is the variable)
const evaluateEquationForX = (equationString: string, xValue: number): number | null => {
  try {
    // Basic sanitization/preparation - replace common math functions if needed
    // For now, direct evaluation with 'x' as a parameter
    const preparedString = equationString.replace(/\^/g, '**'); // Replace ^ with ** for JS exponentiation
    const func = new Function('x', `return ${preparedString}`);
    const result = func(xValue);
    if (typeof result === 'number' && isFinite(result)) {
      return result;
    }
    return null;
  } catch (error) {
    // console.error(`Error evaluating equation "${equationString}" for x=${xValue}:`, error);
    return null;
  }
};

const generatePointsForEquation = (equationString: string, xMin = -10, xMax = 10, numPoints = 100): GraphDataPoint[] => {
  const points: GraphDataPoint[] = [];
  const step = (xMax - xMin) / (numPoints - 1);
  for (let i = 0; i < numPoints; i++) {
    const x = xMin + i * step;
    const y = evaluateEquationForX(equationString, x);
    if (y !== null) {
      points.push({ x, y });
    }
  }
  return points;
};


export default function AdvancedCalculatorPage() {
  const [storedValues, setStoredValues] = useState<StoredValue[]>([]);
  const [directInputValue, setDirectInputValue] = useState<string>(""); // For numeric input

  const [storedEquations, setStoredEquations] = useState<EquationItem[]>([]);

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
    } else {
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
        },
      ]);
      setDirectInputValue("");
    } else {
       console.warn("Attempted to store invalid direct input:", directInputValue);
    }
  }, [directInputValue]);

  const handleDeleteValue = useCallback((id: string) => {
    setStoredValues((prev) => prev.filter((val) => val.id !== id));
  }, []);

  // Equation Management
  const handleAddEquation = useCallback((equationString: string) => {
    if (!equationString.trim()) return;
    setStoredEquations((prev) => [
      ...prev,
      {
        id: `eq-${Date.now()}`,
        equationString,
        plotted: false,
        color: lineColors[prev.length % lineColors.length],
      },
    ]);
  }, []);

  const handleToggleEquationPlot = useCallback((id: string) => {
    setStoredEquations((prev) =>
      prev.map((eq) =>
        eq.id === id ? { ...eq, plotted: !eq.plotted } : eq
      )
    );
  }, []);

  const handleDeleteEquation = useCallback((id: string) => {
    setStoredEquations((prev) => prev.filter((eq) => eq.id !== id));
  }, []);

  const handleClearPlots = useCallback(() => {
    setStoredEquations((prev) => prev.map((eq) => ({ ...eq, plotted: false })));
  }, []);

  const graphableEquationData: FunctionPlotData[] = useMemo(() => {
    return storedEquations
      .filter((eq) => eq.plotted)
      .map((eq) => ({
        id: eq.id,
        points: generatePointsForEquation(eq.equationString),
        color: eq.color,
        name: eq.equationString,
      }));
  }, [storedEquations]);

  return (
    <div className="flex flex-col h-full space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-primary flex items-center justify-center">
            <BarChartHorizontalBig className="mr-3 h-8 w-8" /> Advanced Scientific Calculator & Grapher
          </CardTitle>
          <CardDescription className="text-lg">
            Perform calculations, define functions, and visualize them.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Calculator, Direct Numeric Input, and Stored Numeric Values */}
        <div className="flex flex-col space-y-4">
          <AdvancedCalculatorLayout onStoreResult={handleStoreResultFromCalculator} />
          <Card className="shadow-md">
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
           <Card className="shadow-md w-full">
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

        {/* Column 2: Graph, f(x) Equation Definer, and Stored Equations */}
        <div className="flex flex-col space-y-4">
          <GraphingSection data={graphableEquationData} onClearPlots={handleClearPlots} />
          <FxCalculatorSection onAddEquation={handleAddEquation} />
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center">
                <FunctionSquare className="mr-3 h-7 w-7" /> Stored Equations
              </CardTitle>
              <CardDescription>
                Manage your equations. Check to plot them on the graph.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StoredEquationsContainer
                equations={storedEquations}
                onTogglePlot={handleToggleEquationPlot}
                onDeleteEquation={handleDeleteEquation}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
