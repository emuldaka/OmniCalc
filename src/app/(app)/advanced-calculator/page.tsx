
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

export interface StoredValue {
  id: string;
  value: number;
  label: string;
}

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

    // Handle f(x)=, y=, g(x)= prefixes
    const prefixMatch = exprToEvaluate.match(/^(?:f\(x\)|y|g\(x\))\s*=\s*(.*)/i);
    if (prefixMatch && prefixMatch[1]) {
      exprToEvaluate = prefixMatch[1];
    }

    // IMPORTANT: Order of replacements is crucial
    let preparedString = exprToEvaluate
      // 1. Implicit multiplication (MUST run before function keyword replacements)
      //    number followed by letter or parenthesis: 2x -> 2*x, 2( -> 2*(
      .replace(/(\d(?:\.\d+)?)([a-zA-Z(])/g, '$1*$2')
      //    letter or closing parenthesis followed by number: x2 -> x*2, )2 -> )*2
      .replace(/([a-zA-Z)])(\d(?:\.\d+)?)/g, '$1*$2')
      //    closing parenthesis or letter followed by opening parenthesis or letter: )( -> )*(, x( -> x*(, xy -> x*y
      //    This rule for xy might be too aggressive if 'x' is the only variable and other letters are part of function names.
      //    Let's make it specific to 'x' if it's followed by another letter or open paren, or preceded by a letter/close paren.
      //    e.g. ax -> a*x, xa -> x*a. For 2x, the first rule already covers it.
      //    For cos(2x), we need 2x -> 2*x. This is covered.
      //    The most general form: )x -> )*x, x( -> x*(, )a -> )*a, a( -> a*(, ab -> a*b
      .replace(/([)a-zA-Z])([(a-zA-Z])/g, '$1*$2')


      // 2. Superscripts for powers
      .replace(/²/g, '**2')
      .replace(/³/g, '**3')

      // 3. Specific function patterns (e.g., e^, sqrt, trig, log)
      //    Ensure e^ is matched before standalone 'e' might be converted to Math.E
      //    Regex for e^(<balanced_parentheses_expr>) or e^<simple_expr_with_vars_ops>
      .replace(/e\^(\((?:[^()]+|\((?:[^()]+|\([^()]*\))*\))*\)|[a-zA-Z0-9_.\s\/\*\-\+^()]+)/gi, (match, p1) => `Math.exp(${p1})`)
      .replace(/E\^(\((?:[^()]+|\((?:[^()]+|\([^()]*\))*\))*\)|[a-zA-Z0-9_.\s\/\*\-\+^()]+)/gi, (match, p1) => `Math.exp(${p1})`)


      // Trigonometric functions (case insensitive input, convert to Math.standard)
      // Ensure these are processed after implicit multiplication for arguments like '2x'.
      .replace(/\basin\s*\(([^)]*)\)/gi, (match, p1) => `Math.asin(${p1})`)
      .replace(/\barcsin\s*\(([^)]*)\)/gi, (match, p1) => `Math.asin(${p1})`)
      .replace(/\bacos\s*\(([^)]*)\)/gi, (match, p1) => `Math.acos(${p1})`)
      .replace(/\barccos\s*\(([^)]*)\)/gi, (match, p1) => `Math.acos(${p1})`)
      .replace(/\batan\s*\(([^)]*)\)/gi, (match, p1) => `Math.atan(${p1})`)
      .replace(/\barctan\s*\(([^)]*)\)/gi, (match, p1) => `Math.atan(${p1})`)
      .replace(/\bsin\s*\(([^)]*)\)/gi, (match, p1) => `Math.sin(${p1})`)
      .replace(/\bcos\s*\(([^)]*)\)/gi, (match, p1) => `Math.cos(${p1})`)
      .replace(/\btan\s*\(([^)]*)\)/gi, (match, p1) => `Math.tan(${p1})`)

      // Logarithmic functions
      .replace(/\blog\s*\(([^)]*)\)/gi, (match, p1) => `Math.log10(${p1})`) // log base 10
      .replace(/\bln\s*\(([^)]*)\)/gi, (match, p1) => `Math.log(${p1})`)   // natural log

      // Other math functions
      .replace(/\bsqrt\s*\(([^)]*)\)/gi, (match, p1) => `Math.sqrt(${p1})`)
      .replace(/\babs\s*\(([^)]*)\)/gi, (match, p1) => `Math.abs(${p1})`)

      // 4. General exponentiation (carets) - after specific e^
      .replace(/\^/g, '**')

      // 5. Constants (after functions that might use 'e' or 'pi' as part of their name)
      .replace(/\bpi\b/gi, 'Math.PI')
      .replace(/\be\b/gi, 'Math.E'); // standalone 'e' for Math.E (MUST be after e^ replacement)

    const func = new Function('x', `return ${preparedString}`);
    const result = func(xValue);

    if (typeof result === 'number' && isFinite(result)) {
      return result;
    }
    return null; // Handles NaN, Infinity from evaluation
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


export default function AdvancedCalculatorPage() {
  const [storedValues, setStoredValues] = useState<StoredValue[]>([]);
  const [directInputValue, setDirectInputValue] = useState<string>("");

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
      // console.warn("Attempted to store invalid calculator result:", result);
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
       // console.warn("Attempted to store invalid direct input:", directInputValue);
    }
  }, [directInputValue]);

  const handleDeleteValue = useCallback((id: string) => {
    setStoredValues((prev) => prev.filter((val) => val.id !== id));
  }, []);

  const handleAddEquation = useCallback((equationString: string) => {
    if (!equationString.trim()) return;
    setStoredEquations((prev) => [
      ...prev,
      {
        id: `eq-${Date.now()}`,
        equationString: equationString,
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
