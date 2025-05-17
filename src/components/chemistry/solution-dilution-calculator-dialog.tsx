
// src/components/chemistry/solution-dilution-calculator-dialog.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SolutionDilutionCalculatorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type VariableToSolve = "M1" | "V1" | "M2" | "V2";

export function SolutionDilutionCalculatorDialog({ isOpen, onClose }: SolutionDilutionCalculatorDialogProps) {
  const [m1, setM1] = useState(""); // Initial Molarity
  const [v1, setV1] = useState(""); // Initial Volume
  const [m2, setM2] = useState(""); // Final Molarity
  const [v2, setV2] = useState(""); // Final Volume
  const [solveFor, setSolveFor] = useState<VariableToSolve>("V2");
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    // Clear the field we are solving for when solveFor changes
    if (solveFor === "M1") setM1("");
    if (solveFor === "V1") setV1("");
    if (solveFor === "M2") setM2("");
    if (solveFor === "V2") setV2("");
    setResult(null);
  }, [solveFor]);

  const handleCalculate = () => {
    const numM1 = parseFloat(m1);
    const numV1 = parseFloat(v1);
    const numM2 = parseFloat(m2);
    const numV2 = parseFloat(v2);

    let calculatedValue: number | null = null;
    let unit = "";

    try {
        switch (solveFor) {
        case "M1": // Solve for M1 = (M2 * V2) / V1
            if (isNaN(numM2) || isNaN(numV2) || isNaN(numV1) || numV1 === 0) throw new Error("Invalid inputs for M1 calculation or V1 is zero.");
            calculatedValue = (numM2 * numV2) / numV1;
            unit = "M";
            setM1(calculatedValue.toFixed(4));
            break;
        case "V1": // Solve for V1 = (M2 * V2) / M1
            if (isNaN(numM2) || isNaN(numV2) || isNaN(numM1) || numM1 === 0) throw new Error("Invalid inputs for V1 calculation or M1 is zero.");
            calculatedValue = (numM2 * numV2) / numM1;
            unit = " (volume units)";
            setV1(calculatedValue.toFixed(4));
            break;
        case "M2": // Solve for M2 = (M1 * V1) / V2
            if (isNaN(numM1) || isNaN(numV1) || isNaN(numV2) || numV2 === 0) throw new Error("Invalid inputs for M2 calculation or V2 is zero.");
            calculatedValue = (numM1 * numV1) / numV2;
            unit = "M";
            setM2(calculatedValue.toFixed(4));
            break;
        case "V2": // Solve for V2 = (M1 * V1) / M2
            if (isNaN(numM1) || isNaN(numV1) || isNaN(numM2) || numM2 === 0) throw new Error("Invalid inputs for V2 calculation or M2 is zero.");
            calculatedValue = (numM1 * numV1) / numM2;
            unit = " (volume units)";
            setV2(calculatedValue.toFixed(4));
            break;
        default:
            throw new Error("Unknown variable to solve for.");
        }
        setResult(`${solveFor} = ${calculatedValue?.toFixed(4)}${unit}`);

    } catch (error: any) {
        setResult(error.message);
    }
  };
  
  const resetForm = () => {
    setM1(""); setV1(""); setM2(""); setV2("");
    setResult(null);
    setSolveFor("V2");
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if(!open) resetForm(); onClose();}}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Solution Dilution Calculator (M₁V₁ = M₂V₂)</DialogTitle>
          <DialogDescription>
            Enter three known values to calculate the fourth for solution dilutions.
            Ensure consistent units for volume. Molarity is typically mol/L.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="m1">Initial Molarity (M₁)</Label>
              <Input id="m1" type="number" value={m1} onChange={(e) => setM1(e.target.value)} placeholder="e.g., 2.5" disabled={solveFor === "M1"} />
            </div>
            <div>
              <Label htmlFor="v1">Initial Volume (V₁)</Label>
              <Input id="v1" type="number" value={v1} onChange={(e) => setV1(e.target.value)} placeholder="e.g., 100 (mL or L)" disabled={solveFor === "V1"} />
            </div>
            <div>
              <Label htmlFor="m2">Final Molarity (M₂)</Label>
              <Input id="m2" type="number" value={m2} onChange={(e) => setM2(e.target.value)} placeholder="e.g., 0.5" disabled={solveFor === "M2"} />
            </div>
            <div>
              <Label htmlFor="v2">Final Volume (V₂)</Label>
              <Input id="v2" type="number" value={v2} onChange={(e) => setV2(e.target.value)} placeholder="e.g., 500 (mL or L)" disabled={solveFor === "V2"} />
            </div>
          </div>
          <div>
            <Label htmlFor="solveFor" className="text-primary font-medium">Solve for:</Label>
            <Select value={solveFor} onValueChange={(v) => setSolveFor(v as VariableToSolve)}>
              <SelectTrigger id="solveFor" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M1">Initial Molarity (M₁)</SelectItem>
                <SelectItem value="V1">Initial Volume (V₁)</SelectItem>
                <SelectItem value="M2">Final Molarity (M₂)</SelectItem>
                <SelectItem value="V2">Final Volume (V₂)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCalculate} className="w-full">Calculate</Button>
          {result && (
            <div className="mt-4 p-3 bg-muted rounded-md text-center">
              <p className="font-semibold text-lg text-primary">{result}</p>
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
