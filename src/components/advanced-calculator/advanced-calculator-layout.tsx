
// src/components/advanced-calculator/advanced-calculator-layout.tsx
"use client";

import { useReducer, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AdvancedCalculatorDisplay } from "./advanced-calculator-display";
import { AdvancedCalculatorKeypad } from "./advanced-calculator-keypad";
import { HistoryModal } from "./history-modal"; // Import the new modal
import {
  advancedCalculatorReducer,
  initialState as advancedInitialState,
  AdvancedCalculatorAction,
} from "@/lib/advanced-calculator-engine";
import { Button } from "@/components/ui/button";
import { Save, History as HistoryIcon } from "lucide-react"; // Added HistoryIcon

interface AdvancedCalculatorLayoutProps {
  onStoreResult: (result: string) => void;
}

export function AdvancedCalculatorLayout({ onStoreResult }: AdvancedCalculatorLayoutProps) {
  const [state, dispatch] = useReducer(advancedCalculatorReducer, advancedInitialState);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const handleButtonClick = (action: AdvancedCalculatorAction) => {
    dispatch(action);
  };

  const handleAddToStorageClick = () => {
    if (state.displayValue && state.displayValue !== "Error" && state.displayValue !== "0") {
      onStoreResult(state.displayValue);
    }
  };

  return (
    <>
      <Card className="w-full max-w-3xl shadow-2xl flex flex-col">
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
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button onClick={handleAddToStorageClick} className="w-full" variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Add Result to Storage
            </Button>
            <Button onClick={() => setIsHistoryModalOpen(true)} className="w-full" variant="outline">
              <HistoryIcon className="mr-2 h-4 w-4" />
              View History
            </Button>
          </div>
        </CardContent>
      </Card>
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={state.history}
      />
    </>
  );
}
