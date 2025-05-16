// src/components/shared/server-ai-handler.tsx
"use client";

import { useReducer } from "react";
import { AiInputField } from "@/components/shared/ai-input-field";
import { calculatorReducer, initialState as calculatorInitialState } from "@/lib/calculator-engine";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/settings-context";
import { usePathname } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react";

// This component acts as a client boundary for the AI Input field
// It will decide what to do with the AI result based on context (e.g. current page)
// or display it generically (e.g. in a toast or a modal).

export function ServerAiHandler() {
  // Using calculator's reducer as an example of how AI result might be integrated
  // In a real app, this might be a global state or context specific to AI results.
  const [calculatorState, calculatorDispatch] = useReducer(calculatorReducer, calculatorInitialState);
  const { toast } = useToast();
  const { formatNumber } = useSettings();
  const pathname = usePathname();
  const [aiResultDialog, setAiResultDialog] = useState<{ open: boolean, title: string, description: string, expression?: string }>({ open: false, title: "", description: "" });


  const handleAiResult = (result: string | number, expression: string) => {
    if (pathname.startsWith("/calculator")) {
      // If on calculator page, dispatch to its state (assuming context/prop drilling allows)
      // For this example, we'll dispatch to a local reducer instance.
      // A real implementation would require calculatorDispatch to be from the CalculatorPage context.
      // This is a simplified demonstration.
      // console.log("AI result for calculator:", result, expression);
      // calculatorDispatch({ type: "SET_AI_RESULT", payload: { value: result, expression } });
      // Since we don't have direct access to calculator page's dispatch, show in a dialog/toast.
       if (typeof result === 'number') {
        setAiResultDialog({
          open: true,
          title: "AI Calculation Result",
          description: `The result of "${expression}" is ${formatNumber(result)}.`,
          expression: `${expression} = ${formatNumber(result)}`
        });
      } else { // Error string
         setAiResultDialog({
          open: true,
          title: "AI Calculation Error",
          description: `Could not compute "${expression}". Error: ${result}`,
          expression: expression
        });
      }

    } else if (pathname.startsWith("/converter")) {
      // If on converter page, handle accordingly.
      // Similar to calculator, direct state update is complex from here.
      // console.log("AI result for converter:", result, expression);
      if (typeof result === 'number') {
        setAiResultDialog({
          open: true,
          title: "AI Conversion Result",
          description: `"${expression}" is approximately ${formatNumber(result)}.`,
          expression: `${expression} ≈ ${formatNumber(result)}`
        });
      } else { // Error string
         setAiResultDialog({
          open: true,
          title: "AI Conversion Error",
          description: `Could not convert "${expression}". Error: ${result}`,
          expression: expression
        });
      }
    } else {
      // Generic handling for other pages
      if (typeof result === 'number') {
        toast({
          title: "AI Computation Complete",
          description: `${expression} = ${formatNumber(result)}`,
          duration: 5000,
        });
      } else { // Error string
        toast({
          variant: "destructive",
          title: "AI Computation Error",
          description: result,
          duration: 5000,
        });
      }
    }
  };

  return (
    <>
      <AiInputField onAiResult={handleAiResult} />
      <AlertDialog open={aiResultDialog.open} onOpenChange={(open) => setAiResultDialog(prev => ({...prev, open}))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{aiResultDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {aiResultDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAiResultDialog(prev => ({...prev, open: false}))}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
