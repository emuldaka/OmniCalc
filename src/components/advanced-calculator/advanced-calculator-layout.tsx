// src/components/advanced-calculator/advanced-calculator-layout.tsx
"use client";

import { useReducer } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AdvancedCalculatorDisplay } from "./advanced-calculator-display";
import { AdvancedCalculatorKeypad } from "./advanced-calculator-keypad";
import {
  advancedCalculatorReducer,
  initialState as advancedInitialState,
  AdvancedCalculatorAction,
} from "@/lib/advanced-calculator-engine";

export function AdvancedCalculatorLayout() {
  const [state, dispatch] = useReducer(advancedCalculatorReducer, advancedInitialState);

  const handleButtonClick = (action: AdvancedCalculatorAction) => {
    dispatch(action);
  };

  return (
    <Card className="w-full max-w-2xl shadow-2xl flex flex-col">
      <CardContent className="flex-grow flex flex-col p-4">
        <AdvancedCalculatorDisplay
          displayValue={state.displayValue}
          expression={state.expression}
          isRadians={state.isRadians}
          secondFunctionActive={state.secondFunctionActive}
          error={state.error}
        />
        <div className="mt-4">
          <AdvancedCalculatorKeypad onButtonClick={handleButtonClick} currentState={state} />
        </div>
      </CardContent>
    </Card>
  );
}
