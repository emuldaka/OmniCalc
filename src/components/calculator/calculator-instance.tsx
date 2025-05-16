// src/components/calculator/calculator-instance.tsx
"use client";

import { useReducer } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculatorDisplay } from "@/components/calculator/calculator-display";
import { CalculatorKeypad } from "@/components/calculator/calculator-keypad";
import { calculatorReducer, initialState } from "@/lib/calculator-engine";
import type { CalculatorState } from "@/lib/calculator-engine";
import { useSettings } from "@/contexts/settings-context";

interface CalculatorInstanceProps {
  instanceId: number; // or string
}

export function CalculatorInstance({ instanceId }: CalculatorInstanceProps) {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);
  const { formatNumber } = useSettings();

  const handleKeypadClick = (type: string, value?: string) => {
    // console.log(`Instance ${instanceId} keypad: ${type} ${value}`);
    switch (type) {
      case "ADD_DIGIT":
        dispatch({ type: "ADD_DIGIT", payload: value! });
        break;
      case "CHOOSE_OPERATION":
        dispatch({ type: "CHOOSE_OPERATION", payload: value! });
        break;
      case "CLEAR_ALL":
        dispatch({ type: "CLEAR_ALL" });
        break;
      case "CLEAR_ENTRY":
        dispatch({ type: "CLEAR_ENTRY" });
        break;
      case "DELETE_DIGIT":
        dispatch({ type: "DELETE_DIGIT" });
        break;
      case "EVALUATE":
        dispatch({ type: "EVALUATE" });
        break;
      case "TOGGLE_SIGN":
        dispatch({ type: "TOGGLE_SIGN" });
        break;
      case "PERCENTAGE": // Kept for completeness, though replaced by ^ in main buttons
        dispatch({ type: "PERCENTAGE" });
        break;
      case "SQUARE_ROOT":
        dispatch({ type: "SQUARE_ROOT" });
        break;
      default:
        break;
    }
  };

  // This function would be called if ServerAiHandler could target this specific instance.
  // For now, SET_AI_RESULT is in the reducer, but not actively called by the global AI input.
  const handleAiResultForThisCalculator = (result: string | number, expression: string) => {
     dispatch({ type: "SET_AI_RESULT", payload: { value: result, expression } });
  };

  let secondaryDisplayContent = state.expression;
  if (state.error) {
    secondaryDisplayContent = state.error;
  } else if (state.previousOperand && state.operation && !state.overwrite) {
     secondaryDisplayContent = `${formatNumber(state.previousOperand)} ${state.operation}`;
  } else if (state.previousOperand && state.operation && state.overwrite) {
     secondaryDisplayContent = `${formatNumber(state.previousOperand)} ${state.operation}`;
  }

  return (
    <Card className="w-full shadow-2xl flex flex-col"> {/* max-w-lg removed, flex-col added */}
      <CardHeader className="pb-2 pt-4 px-4"> {/* Reduced padding */}
        {/* <CardTitle className="text-lg text-center text-primary">Calculator {instanceId}</CardTitle> */}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-4"> {/* Added flex-grow and flex-col */}
        <CalculatorDisplay 
          mainDisplay={state.error ? "Error" : state.displayValue}
          secondaryDisplay={secondaryDisplayContent}
        />
        <div className="mt-auto"> {/* Pushes keypad to bottom if CardContent has extra space */}
            <CalculatorKeypad onButtonClick={handleKeypadClick} currentState={state} />
        </div>
      </CardContent>
    </Card>
  );
}
