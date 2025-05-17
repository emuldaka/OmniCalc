// src/components/advanced-calculator/advanced-calculator-layout.tsx
"use client";

import { useState } from "react";
import type { Dispatch } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AdvancedCalculatorDisplay } from "./advanced-calculator-display";
import { AdvancedCalculatorKeypad } from "./advanced-calculator-keypad";
import { HistoryModal } from "./history-modal";
import { AdvancedCalculatorState, AdvancedCalculatorAction } from "@/lib/advanced-calculator-engine";
import { Button } from "@/components/ui/button";
import { Save, History as HistoryIcon } from "lucide-react";

interface AdvancedCalculatorLayoutProps {
  engineState: AdvancedCalculatorState;
  engineDispatch: Dispatch<AdvancedCalculatorAction>;
  onStoreResult: (result: string) => void;
}

export function AdvancedCalculatorLayout({ engineState, engineDispatch, onStoreResult }: AdvancedCalculatorLayoutProps) {
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const handleAddToStorageClick = () => {
    if (engineState.displayValue && engineState.displayValue !== "Error" && engineState.displayValue !== "0") {
      onStoreResult(engineState.displayValue);
    }
  };

  return (
    <>
      <Card className="w-full max-w-3xl shadow-2xl flex flex-col">
        <CardContent className="flex-grow flex flex-col p-4">
          <AdvancedCalculatorDisplay
            displayValue={engineState.displayValue}
            expression={engineState.expression}
            isRadians={engineState.isRadians}
            secondFunctionActive={engineState.secondFunctionActive}
            error={engineState.error}
          />
          <div className="mt-4">
            <AdvancedCalculatorKeypad engineDispatch={engineDispatch} currentState={engineState} />
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
        history={engineState.history}
      />
    </>
  );
}
