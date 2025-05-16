// src/app/(app)/calculator/page.tsx
"use client";

import { useReducer } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculatorDisplay } from "@/components/calculator/calculator-display";
import { CalculatorKeypad } from "@/components/calculator/calculator-keypad";
import { calculatorReducer, initialState } from "@/lib/calculator-engine";
import type { CalculatorState } from "@/lib/calculator-engine";
import { useSettings } from "@/contexts/settings-context";
// AiInputField is now handled by ServerAiHandler in the layout
// import { AiInputField } from "@/components/shared/ai-input-field";


export default function CalculatorPage() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);
  const { formatNumber } = useSettings();

  const handleKeypadClick = (type: string, value?: string) => {
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
      case "PERCENTAGE":
        dispatch({ type: "PERCENTAGE" });
        break;
      case "SQUARE_ROOT":
        dispatch({ type: "SQUARE_ROOT" });
        break;
      default:
        break;
    }
  };

  // This function will be called by ServerAiHandler via context or props if needed,
  // or ServerAiHandler directly updates the calculator state.
  // For now, assuming ServerAiHandler might use this if it were a prop.
  // In the current setup, ServerAiHandler directly dispatches.
  const handleAiResultForCalculator = (result: string | number, expression: string) => {
     dispatch({ type: "SET_AI_RESULT", payload: { value: result, expression } });
  };

  // Construct the secondary display string based on current state
  let secondaryDisplayContent = state.expression;
  if (state.error) {
    secondaryDisplayContent = state.error;
  } else if (state.previousOperand && state.operation && !state.overwrite) {
     secondaryDisplayContent = `${formatNumber(state.previousOperand)} ${state.operation}`;
  } else if (state.previousOperand && state.operation && state.overwrite) {
     secondaryDisplayContent = `${formatNumber(state.previousOperand)} ${state.operation}`;
  }


  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary">Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          {/* AI Input Field is now in the header via (app)/layout.tsx and ServerAiHandler */}
          {/* <div className="mb-4">
            <AiInputField onAiResult={handleAiResultForCalculator} placeholder="AI: 2 + 2 or 10% of 50"/>
          </div> */}
          <CalculatorDisplay 
            mainDisplay={state.error ? "Error" : state.displayValue}
            secondaryDisplay={secondaryDisplayContent}
          />
          <CalculatorKeypad onButtonClick={handleKeypadClick} currentState={state} />
        </CardContent>
      </Card>
    </div>
  );
}

// This component wrapper is for ServerAiHandler to communicate back to this page's specific dispatcher.
// For now, ServerAiHandler will update a global store or use a more generic callback.
// If direct update to this page's state is needed, a context or prop drilling for `handleAiResultForCalculator`
// would be required from the layout level.
// The current AiInputField is designed to be used directly where its results are consumed.
// As ServerAiHandler is in the layout, it needs a way to target where results go.
// For this iteration, we'll assume AI results are handled by the ServerAiHandler itself,
// potentially showing in a toast or a dedicated AI output area if not directly tied to the current page's main display.
// The `SET_AI_RESULT` action in the calculator reducer is available if ServerAiHandler can call it.
// Let's assume `ServerAiHandler` is enhanced to call `dispatch({ type: "SET_AI_RESULT", ... })`
// if the current page is '/calculator'. This would likely involve a shared context/state.
