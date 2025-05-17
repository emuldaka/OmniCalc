
// src/components/physics/kinematics-calculator-dialog.tsx
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

interface KinematicsCalculatorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type VariableToSolve = "s" | "u" | "v" | "a" | "t";
// s: displacement, u: initial velocity, v: final velocity, a: acceleration, t: time

export function KinematicsCalculatorDialog({ isOpen, onClose }: KinematicsCalculatorDialogProps) {
  const [s, setS] = useState("");
  const [u, setU] = useState("");
  const [v, setV] = useState("");
  const [a, setA] = useState("");
  const [t, setT] = useState("");
  const [solveFor, setSolveFor] = useState<VariableToSolve>("s");
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const resetForm = () => {
    setS(""); setU(""); setV(""); setA(""); setT("");
    setResult(null);
    setSolveFor("s");
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);
  
  useEffect(() => {
    // Clear the field we are solving for when solveFor changes
    if (solveFor === "s") setS("");
    if (solveFor === "u") setU("");
    if (solveFor === "v") setV("");
    if (solveFor === "a") setA("");
    if (solveFor === "t") setT("");
    setResult(null);
  }, [solveFor]);


  const handleCalculate = () => {
    const numS = s !== "" ? parseFloat(s) : undefined;
    const numU = u !== "" ? parseFloat(u) : undefined;
    const numV = v !== "" ? parseFloat(v) : undefined;
    const numA = a !== "" ? parseFloat(a) : undefined;
    const numT = t !== "" ? parseFloat(t) : undefined;

    let calculatedValue: number | null = null;
    let calculationDescription = "";

    try {
      if (solveFor === "s") {
        if (numU !== undefined && numA !== undefined && numT !== undefined) { // s = ut + 0.5at^2
          calculatedValue = numU * numT + 0.5 * numA * numT * numT;
          calculationDescription = "s = v₀t + ½at²";
          setS(calculatedValue.toFixed(3));
        } else if (numU !== undefined && numV !== undefined && numT !== undefined) { // s = 0.5(u+v)t
          calculatedValue = 0.5 * (numU + numV) * numT;
          calculationDescription = "s = ½(v₀+v)t";
          setS(calculatedValue.toFixed(3));
        } else if (numV !== undefined && numU !== undefined && numA !== undefined) { // v^2 = u^2 + 2as => s = (v^2 - u^2) / 2a
           if (numA === 0) throw new Error("Acceleration (a) cannot be zero for this s calculation.");
           calculatedValue = (numV*numV - numU*numU) / (2 * numA);
           calculationDescription = "s = (v²-v₀²)/(2a)";
           setS(calculatedValue.toFixed(3));
        } else {
          throw new Error("Insufficient variables provided to solve for displacement (s). Need (u,a,t) or (u,v,t) or (v,u,a).");
        }
      } else if (solveFor === "v") {
        if (numU !== undefined && numA !== undefined && numT !== undefined) { // v = u + at
            calculatedValue = numU + numA * numT;
            calculationDescription = "v = v₀ + at";
            setV(calculatedValue.toFixed(3));
        } else if (numU !== undefined && numA !== undefined && numS !== undefined) { // v^2 = u^2 + 2as
            const vSq = numU*numU + 2*numA*numS;
            if(vSq < 0) throw new Error("Cannot calculate v (v² is negative). Check inputs.");
            calculatedValue = Math.sqrt(vSq); // Note: could be +/-
            calculationDescription = "v = √(v₀² + 2as) (positive root shown)";
            setV(calculatedValue.toFixed(3));
        } else {
            throw new Error("Insufficient variables provided to solve for final velocity (v). Need (u,a,t) or (u,a,s).");
        }
      } else if (solveFor === "u") {
        // Similar logic for u, a, t using other kinematic equations
        if (numV !== undefined && numA !== undefined && numT !== undefined) { // u = v - at
          calculatedValue = numV - numA * numT;
          calculationDescription = "v₀ = v - at";
          setU(calculatedValue.toFixed(3));
        } else {
          throw new Error("Insufficient variables for initial velocity (u). Need (v,a,t). More options can be added.");
        }
      } else if (solveFor === "a") {
         if (numV !== undefined && numU !== undefined && numT !== undefined && numT !== 0) { // a = (v-u)/t
          calculatedValue = (numV - numU) / numT;
          calculationDescription = "a = (v-v₀)/t";
          setA(calculatedValue.toFixed(3));
         } else {
            throw new Error("Insufficient variables for acceleration (a). Need (v,u,t with t≠0). More options can be added.");
         }
      } else if (solveFor === "t") {
        if (numV !== undefined && numU !== undefined && numA !== undefined && numA !== 0) { // t = (v-u)/a
            calculatedValue = (numV - numU) / numA;
            calculationDescription = "t = (v-v₀)/a";
            setT(calculatedValue.toFixed(3));
        } else {
             throw new Error("Insufficient variables for time (t). Need (v,u,a with a≠0). More options can beadek.");
        }
      }
      
      if (calculatedValue !== null) {
        setResult(`${solveFor.toUpperCase()} = ${calculatedValue.toFixed(3)} (using ${calculationDescription})`);
      }

    } catch (error: any) {
      setResult(`Error: ${error.message}`);
      toast({ variant: "destructive", title: "Calculation Error", description: error.message });
    }
  };

  const inputFields = [
    { label: "Displacement (s)", value: s, setter: setS, id: "s" as VariableToSolve, unit: "m" },
    { label: "Initial Velocity (v₀ or u)", value: u, setter: setU, id: "u" as VariableToSolve, unit: "m/s" },
    { label: "Final Velocity (v)", value: v, setter: setV, id: "v" as VariableToSolve, unit: "m/s" },
    { label: "Acceleration (a)", value: a, setter: setA, id: "a" as VariableToSolve, unit: "m/s²" },
    { label: "Time (t)", value: t, setter: setT, id: "t" as VariableToSolve, unit: "s" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if(!open) resetForm(); onClose();}}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>1D Kinematics Calculator</DialogTitle>
          <DialogDescription>
            Enter any 3 known values for 1D motion with constant acceleration to solve for a fourth. Leave the variable to solve for blank OR select it below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <div className="grid grid-cols-2 gap-3">
            {inputFields.map(field => (
              <div key={field.id}>
                <Label htmlFor={field.id}>{field.label} <span className="text-xs text-muted-foreground">({field.unit})</span></Label>
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
            <Label htmlFor="solveFor" className="text-primary font-medium">Solve for:</Label>
            <Select value={solveFor} onValueChange={(v) => setSolveFor(v as VariableToSolve)}>
              <SelectTrigger id="solveFor" className="mt-1">
                <SelectValue />
              </SelectTrigger>
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
