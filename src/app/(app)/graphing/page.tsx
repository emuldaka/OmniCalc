
// src/app/(app)/graphing/page.tsx
"use client";

import { useState, useCallback, useMemo } from "react";
import { GraphingSection } from "@/components/advanced-calculator/graphing-section";
import { FxCalculatorSection } from "@/components/advanced-calculator/fx-calculator-section";
import { StoredEquationsContainer } from "@/components/advanced-calculator/stored-equations-container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LineChart as LineChartIcon, FunctionSquare } from "lucide-react";

export interface EquationItem {
  id: string;
  equationString: string;
  plottedGraph1: boolean;
  plottedGraph2: boolean;
  plottedGraph3: boolean;
  plottedGraph4: boolean; // Added for the fourth graph
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

    // Strip common prefixes like f(x)=, y=
    const prefixMatch = exprToEvaluate.match(/^(?:f\(x\)|y|g\(x\))\s*=\s*(.*)/i);
    if (prefixMatch && prefixMatch[1]) {
      exprToEvaluate = prefixMatch[1];
    }
    
    // More robust implicit multiplication and function parsing
    let preparedString = exprToEvaluate
      // Implicit multiplication: number before x or (, x or ) before number or (, x or ) before x or (, ) before (
      .replace(/(?<![a-zA-Z0-9_])([0-9.]+)([xX(a-zA-Z])/gi, '$1*$2') 
      .replace(/([xX)])([0-9.(a-zA-Z])/gi, '$1*$2') 
      .replace(/([xX)])([xX(])/gi, '$1*$2')    
      .replace(/(\))(\()/gi, '$1*$2')          
      // Superscripts
      .replace(/²/g, '**2')
      .replace(/³/g, '**3')
      // Named functions (order matters for things like e^ vs e)
      // Match "func(...)" and use callback to ensure argument is treated literally
      .replace(/e\^\(([^)]*)\)/gi, (match, p1) => `Math.exp(${p1})`)
      .replace(/E\^\(([^)]*)\)/gi, (match, p1) => `Math.exp(${p1})`)
      .replace(/e\^([a-zA-Z0-9_.\/*\-+^()]+)/gi, (match, p1) => `Math.exp(${p1})`) 
      .replace(/E\^([a-zA-Z0-9_.\/*\-+^()]+)/gi, (match, p1) => `Math.exp(${p1})`) 
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
      // General exponentiation
      .replace(/\^/g, '**')
      // Constants (pi and e should be last to avoid conflicts with function names like 'exp')
      .replace(/\bpi\b/gi, 'Math.PI')
      .replace(/\be\b/gi, 'Math.E'); 

    const func = new Function('x', `return ${preparedString}`);
    const result = func(xValue);

    if (typeof result === 'number' && isFinite(result)) {
      return result;
    }
    // console.error(`Evaluation returned non-finite or non-number for "${equationString}" (prepared: "${preparedString}") with x=${xValue}:`, result);
    return null;
  } catch (error) {
    // Uncomment for debugging parsing errors
    // console.error(`Error evaluating equation "${equationString}" (raw) -> "${exprToEvaluate}" (stripped) -> "${preparedString}" (prepared) for x=${xValue}:`, error);
    return null;
  }
};

const generatePointsForEquation = (equationString: string, xMin = -10, xMax = 10, numPoints = 200): GraphDataPoint[] => {
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
        plottedGraph1: true, 
        plottedGraph2: false,
        plottedGraph3: false,
        plottedGraph4: false, // Default for new graph
        color: lineColors[prev.length % lineColors.length],
      },
    ]);
  }, []);

  const handleToggleEquationPlotOnGraph = useCallback((id: string, graphNumber: 1 | 2 | 3 | 4) => {
    setStoredEquations((prev) =>
      prev.map((eq) => {
        if (eq.id === id) {
          if (graphNumber === 1) return { ...eq, plottedGraph1: !eq.plottedGraph1 };
          if (graphNumber === 2) return { ...eq, plottedGraph2: !eq.plottedGraph2 };
          if (graphNumber === 3) return { ...eq, plottedGraph3: !eq.plottedGraph3 };
          if (graphNumber === 4) return { ...eq, plottedGraph4: !eq.plottedGraph4 };
        }
        return eq;
      })
    );
  }, []);

  const handleDeleteEquation = useCallback((id: string) => {
    setStoredEquations((prev) => prev.filter((eq) => eq.id !== id));
  }, []);

  const handleClearPlotsForGraph = useCallback((graphNumber: 1 | 2 | 3 | 4) => {
    setStoredEquations((prev) =>
      prev.map((eq) => {
        if (graphNumber === 1) return { ...eq, plottedGraph1: false };
        if (graphNumber === 2) return { ...eq, plottedGraph2: false };
        if (graphNumber === 3) return { ...eq, plottedGraph3: false };
        if (graphNumber === 4) return { ...eq, plottedGraph4: false };
        return eq;
      })
    );
  }, []);

  const graphDataForPlot1: FunctionPlotData[] = useMemo(() => {
    return storedEquations
      .filter((eq) => eq.plottedGraph1)
      .map((eq) => ({
        id: eq.id,
        points: generatePointsForEquation(eq.equationString),
        color: eq.color,
        name: eq.equationString.length > 30 ? eq.equationString.substring(0, 27) + "..." : eq.equationString,
      }));
  }, [storedEquations]);

  const graphDataForPlot2: FunctionPlotData[] = useMemo(() => {
    return storedEquations
      .filter((eq) => eq.plottedGraph2)
      .map((eq) => ({
        id: eq.id,
        points: generatePointsForEquation(eq.equationString),
        color: eq.color,
        name: eq.equationString.length > 30 ? eq.equationString.substring(0, 27) + "..." : eq.equationString,
      }));
  }, [storedEquations]);

  const graphDataForPlot3: FunctionPlotData[] = useMemo(() => {
    return storedEquations
      .filter((eq) => eq.plottedGraph3)
      .map((eq) => ({
        id: eq.id,
        points: generatePointsForEquation(eq.equationString),
        color: eq.color,
        name: eq.equationString.length > 30 ? eq.equationString.substring(0, 27) + "..." : eq.equationString,
      }));
  }, [storedEquations]);

  const graphDataForPlot4: FunctionPlotData[] = useMemo(() => {
    return storedEquations
      .filter((eq) => eq.plottedGraph4)
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
            Define functions, plot them on multiple graphs, and manage your equations.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Controls Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FxCalculatorSection onAddEquation={handleAddEquation} />
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-primary flex items-center">
              <FunctionSquare className="mr-3 h-7 w-7" /> Stored Equations
            </CardTitle>
            <CardDescription>
              Manage your equations. Check to plot them on the desired graph (G1, G2, G3, G4).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StoredEquationsContainer
              equations={storedEquations}
              onTogglePlot={handleToggleEquationPlotOnGraph}
              onDeleteEquation={handleDeleteEquation}
            />
          </CardContent>
        </Card>
      </div>

      {/* Graphs Section - 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GraphingSection 
          data={graphDataForPlot1} 
          onClearPlots={() => handleClearPlotsForGraph(1)}
          graphTitle="Graph 1"
        />
        <GraphingSection 
          data={graphDataForPlot2} 
          onClearPlots={() => handleClearPlotsForGraph(2)}
          graphTitle="Graph 2"
        />
        <GraphingSection 
          data={graphDataForPlot3} 
          onClearPlots={() => handleClearPlotsForGraph(3)}
          graphTitle="Graph 3"
        />
        <GraphingSection 
          data={graphDataForPlot4} 
          onClearPlots={() => handleClearPlotsForGraph(4)}
          graphTitle="Graph 4"
        />
      </div>
    </div>
  );
}
