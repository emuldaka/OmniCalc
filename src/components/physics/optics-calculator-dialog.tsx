
// src/components/physics/optics-calculator-dialog.tsx
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
import { useToast } from "@/hooks/use-toast";

interface OpticsCalculatorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type VariableToSolve = "f" | "do" | "di" | "M" | "hi" | "ho";
// f: focal length, do: object distance, di: image distance
// M: magnification, hi: image height, ho: object height

export function OpticsCalculatorDialog({ isOpen, onClose }: OpticsCalculatorDialogProps) {
  const [f, setF] = useState("");
  const [doVal, setDoVal] = useState(""); // do is a reserved keyword
  const [di, setDi] = useState("");
  const [M, setM] = useState("");
  const [hi, setHi] = useState("");
  const [ho, setHo] = useState("");

  const [solveFor, setSolveFor] = useState<VariableToSolve>("f");
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const resetForm = () => {
    setF(""); setDoVal(""); setDi(""); setM(""); setHi(""); setHo("");
    setResult(null);
    setSolveFor("f");
  };

  useEffect(() => { if (!isOpen) resetForm(); }, [isOpen]);
  useEffect(() => {
    if (solveFor === "f") setF("");
    if (solveFor === "do") setDoVal("");
    if (solveFor === "di") setDi("");
    if (solveFor === "M") setM("");
    if (solveFor === "hi") setHi("");
    if (solveFor === "ho") setHo("");
    setResult(null);
  }, [solveFor]);

  const handleCalculate = () => {
    const numF = f !== "" ? parseFloat(f) : undefined;
    const numDo = doVal !== "" ? parseFloat(doVal) : undefined;
    const numDi = di !== "" ? parseFloat(di) : undefined;
    const numM = M !== "" ? parseFloat(M) : undefined;
    const numHi = hi !== "" ? parseFloat(hi) : undefined;
    const numHo = ho !== "" ? parseFloat(ho) : undefined;

    let calculatedValue: number | null = null;
    let calculationDescription = "";
    let unit = "(length units)"; // Default unit note

    try {
      if (solveFor === "f") { // 1/f = 1/do + 1/di => f = (do * di) / (do + di)
        if (numDo === undefined || numDi === undefined) throw new Error("Need Object Distance (do) and Image Distance (di) to find Focal Length (f).");
        if (numDo + numDi === 0) throw new Error("Sum of do and di cannot be zero for f calculation.");
        calculatedValue = (numDo * numDi) / (numDo + numDi);
        setF(calculatedValue.toFixed(3));
        calculationDescription = "Focal Length (f = (dₒ × dᵢ) / (dₒ + dᵢ))";
      } else if (solveFor === "do") { // 1/do = 1/f - 1/di => do = (f * di) / (di - f)
        if (numF === undefined || numDi === undefined) throw new Error("Need Focal Length (f) and Image Distance (di) to find Object Distance (do).");
        if (numDi - numF === 0) throw new Error("di - f cannot be zero for do calculation.");
        calculatedValue = (numF * numDi) / (numDi - numF);
        setDoVal(calculatedValue.toFixed(3));
        calculationDescription = "Object Distance (dₒ = (f × dᵢ) / (dᵢ - f))";
      } else if (solveFor === "di") { // 1/di = 1/f - 1/do => di = (f * do) / (do - f)
        if (numF === undefined || numDo === undefined) throw new Error("Need Focal Length (f) and Object Distance (do) to find Image Distance (di).");
        if (numDo - numF === 0) throw new Error("do - f cannot be zero for di calculation.");
        calculatedValue = (numF * numDo) / (numDo - numF);
        setDi(calculatedValue.toFixed(3));
        calculationDescription = "Image Distance (dᵢ = (f × dₒ) / (dₒ - f))";
      } else if (solveFor === "M") { // M = -di/do OR M = hi/ho
        if (numDi !== undefined && numDo !== undefined && numDo !== 0) {
          calculatedValue = -numDi / numDo;
          calculationDescription = "Magnification (M = -dᵢ/dₒ)";
          unit = "(dimensionless)";
        } else if (numHi !== undefined && numHo !== undefined && numHo !== 0) {
          calculatedValue = numHi / numHo;
          calculationDescription = "Magnification (M = hᵢ/hₒ)";
          unit = "(dimensionless)";
        } else {
          throw new Error("Need (di, do) or (hi, ho) to find Magnification (M). Ensure denominators are not zero.");
        }
        setM(calculatedValue.toFixed(3));
      } else {
        throw new Error("Calculation for this variable is not yet implemented or requires more inputs.");
      }
      
      setResult(`${calculationDescription}: ${calculatedValue?.toFixed(3)} ${unit}`);

    } catch (error: any) {
      setResult(`Error: ${error.message}`);
      toast({ variant: "destructive", title: "Calculation Error", description: error.message });
    }
  };
  
  const inputFields = [
    { label: "Focal Length (f)", value: f, setter: setF, id: "f" as VariableToSolve },
    { label: "Object Distance (dₒ)", value: doVal, setter: setDoVal, id: "do" as VariableToSolve },
    { label: "Image Distance (dᵢ)", value: di, setter: setDi, id: "di" as VariableToSolve },
    { label: "Magnification (M)", value: M, setter: setM, id: "M" as VariableToSolve, unit: "" },
    { label: "Image Height (hᵢ)", value: hi, setter: setHi, id: "hi" as VariableToSolve },
    { label: "Object Height (hₒ)", value: ho, setter: setHo, id: "ho" as VariableToSolve },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if(!open) resetForm(); onClose();}}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Optics Calculator (Thin Lens/Mirror)</DialogTitle>
          <DialogDescription>
            Uses 1/f = 1/dₒ + 1/dᵢ and M = -dᵢ/dₒ = hᵢ/hₒ. Ensure consistent units for lengths. (Sign conventions apply).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {inputFields.map(field => (
              <div key={field.id}>
                <Label htmlFor={field.id}>{field.label} <span className="text-xs text-muted-foreground">{field.unit || "(length units)"}</span></Label>
                <Input 
                  id={field.id} 
                  type="number" 
                  value={field.value} 
                  onChange={(e) => field.setter(e.target.value)} 
                  placeholder="Enter value" 
                  disabled={solveFor === field.id} 
                />
              </div>
            ))}
          </div>
          <div>
            <Label htmlFor="solveForOptics" className="text-primary font-medium">Solve for:</Label>
            <Select value={solveFor} onValueChange={(v) => setSolveFor(v as VariableToSolve)}>
              <SelectTrigger id="solveForOptics" className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {inputFields.map(field => (
                    <SelectItem key={`select-${field.id}`} value={field.id}>{field.label.split(" (")[0]}</SelectItem>
                ))}
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
