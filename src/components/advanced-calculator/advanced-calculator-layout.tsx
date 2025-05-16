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
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface AdvancedCalculatorLayoutProps {
  onStoreResult: (result: string) => void;
}

export function AdvancedCalculatorLayout({ onStoreResult }: AdvancedCalculatorLayoutProps) {
  const [state, dispatch] = useReducer(advancedCalculatorReducer, advancedInitialState);

  const handleButtonClick = (action: AdvancedCalculatorAction) => {
    dispatch(action);
  };

  const handleAddToStorageClick = () => {
    if (state.displayValue && state.displayValue !== "Error" && state.displayValue !== "0") {
      onStoreResult(state.displayValue);
    }
    // Optionally, provide feedback if value is not storable
  };

  return (
    <Card className="w-full max-w-3xl shadow-2xl flex flex-col"> {/* max-w-2xl to max-w-3xl to match page */}
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
        <Button onClick={handleAddToStorageClick} className="mt-4 w-full" variant="outline">
          <Save className="mr-2 h-4 w-4" />
          Add Calculator Result to Storage
        </Button>
      </CardContent>
    </Card>
  );
}
