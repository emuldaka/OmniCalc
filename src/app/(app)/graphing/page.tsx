
// src/app/(app)/graphing/page.tsx
"use client";

import { useState, useCallback, useMemo } from "react";
import { GraphingSection } from "@/components/advanced-calculator/graphing-section";
import { FxCalculatorSection } from "@/components/advanced-calculator/fx-calculator-section";
import { StoredEquationsContainer } from "@/components/advanced-calculator/stored-equations-container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LineChart as LineChartIcon, FunctionSquare } from "lucide-react"; // Renamed to avoid conflict

export interface EquationItem {
  id: string;
  equationString: string;
  plotted: boolean;
  color: string;
}

export type GraphDataPoint = {
  x: number;
  y: number;
};

export interface FunctionPlotData {
    id: string;
    points: GraphDataPoint[];
    color: string;
    name: string;
}

const lineColors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

const evaluateEquationForX = (equationString: string, xValue: number): number | null => {
  try {
    let exprToEvaluate = equationString;

    const prefixMatch = exprToEvaluate.match(/^(?:f\(x\)|y|g\(x\))\s*=\s*(.*)/i);
    if (prefixMatch && prefixMatch[1]) {
      exprToEvaluate = prefixMatch[1];
    }
    
    let preparedString = exprToEvaluate
      .replace(/(\d(?:\.\d+)?)([xX(])/gi, '$1*$2') 
      .replace(/([xX)])(\d(?:\.\d+)?)/gi, '$1*$2') 
      .replace(/([xX)])([xX(])/gi, '$1*$2') 
      .replace(/²/g, '**2')
      .replace(/³/g, '**3')
      .replace(/e\^(\((?:[^()]+|\((?:[^()]+|\([^()]*\))*\))*\)|[a-zA-Z0-9_.\s\/\*\-\+^()]+)/gi, (match, p1) => `Math.exp(${p1})`)
      .replace(/E\^(\((?:[^()]+|\((?:[^()]+|\([^()]*\))*\))*\)|[a-zA-Z0-9_.\s\/\*\-\+^()]+)/gi, (match, p1) => `Math.exp(${p1})`)
      .replace(/\basin\s*\(([^)]*)\)/gi, (match, p1) => `Math.asin(${p1})`)
      .replace(/\barcsin\s*\(([^)]*)\)/gi, (match, p1) => `Math.asin(${p1})`)
      .replace(/\bacos\s*\(([^)]*)\)/gi, (match, p1) => `Math.acos(${p1})`)
      .replace(/\barccos\s*\(([^)]*)\)/gi, (match, p1) => `Math.acos(${p1})`)
      .replace(/\batan\s*\(([^)]*)\)/gi, (match, p1) => `Math.atan(${p1})`)
      .replace(/\barctan\s*\(([^)]*)\)/gi, (match, p1) => `Math.atan(${p1})`)
      .replace(/\bsin\s*\(([^)]*)\)/gi, (match, p1) => `Math.sin(${p1})`)
      .replace(/\bcos\s*\(([^)]*)\)/gi, (match, p1) => `Math.cos(${p1})`)
      .replace(/\btan\s*\(([^)]*)\)/gi, (match, p1) => `Math.tan(${p1})`)
      .replace(/\blog\s*\(([^)]*)\)/gi, (match, p1) => `Math.log10(${p1})`)
      .replace(/\bln\s*\(([^)]*)\)/gi, (match, p1) => `Math.log(${p1})`)
      .replace(/\bsqrt\s*\(([^)]*)\)/gi, (match, p1) => `Math.sqrt(${p1})`)
      .replace(/\babs\s*\(([^)]*)\)/gi, (match, p1) => `Math.abs(${p1})`)
      .replace(/\^/g, '**')
      .replace(/\bpi\b/gi, 'Math.PI')
      .replace(/\be\b/gi, 'Math.E');

    const func = new Function('x', `return ${preparedString}`);
    const result = func(xValue);

    if (typeof result === 'number' && isFinite(result)) {
      return result;
    }
    return null;
  } catch (error) {
    // console.error(`Error evaluating equation "${equationString}" (raw) -> "${exprToEvaluate}" (stripped) -> "${preparedString}" (prepared) for x=${xValue}:`, error);
    return null;
  }
};

const generatePointsForEquation = (equationString: string, xMin = -10, xMax = 10, numPoints = 100): GraphDataPoint[] => {
  const points: GraphDataPoint[] = [];
  if (numPoints <= 1) return points;
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


export default function GraphingPage() {
  const [storedEquations, setStoredEquations] = useState<EquationItem[]>([]);

  const handleAddEquation = useCallback((equationString: string) => {
    if (!equationString.trim()) return;
    setStoredEquations((prev) => [
      ...prev,
      {
        id: `eq-${Date.now()}`,
        equationString: equationString,
        plotted: true, // Plot by default when added
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
        name: eq.equationString.length > 30 ? eq.equationString.substring(0, 27) + "..." : eq.equationString,
      }));
  }, [storedEquations]);

  return (
    <div className="flex flex-col h-full space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-primary flex items-center justify-center">
            <LineChartIcon className="mr-3 h-8 w-8" /> Graphing Calculator
          </CardTitle>
          <CardDescription className="text-lg">
            Define functions, plot them, and manage your equations.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Graph */}
        <div className="flex flex-col space-y-4">
          <GraphingSection data={graphableEquationData} onClearPlots={handleClearPlots} />
        </div>

        {/* Column 2: f(x) Equation Definer, and Stored Equations */}
        <div className="flex flex-col space-y-4">
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
