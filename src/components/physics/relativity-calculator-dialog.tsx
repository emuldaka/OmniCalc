
// src/components/physics/relativity-calculator-dialog.tsx
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
import { physicalConstantsData } from "./physical-constants-data";

const SPEED_OF_LIGHT = physicalConstantsData.find(c => c.id === 'c')?.value || 299792458; // m/s

interface RelativityCalculatorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type CalculationType = 
  | "time_dilation" 
  | "length_contraction" 
  | "relativistic_momentum"
  | "energy_mass_equivalence";

export function RelativityCalculatorDialog({ isOpen, onClose }: RelativityCalculatorDialogProps) {
  const [calcType, setCalcType] = useState<CalculationType>("time_dilation");
  // Inputs
  const [properTime, setProperTime] = useState(""); // t₀
  const [velocity, setVelocity] = useState("");     // v
  const [properLength, setProperLength] = useState(""); // L₀
  const [restMass, setRestMass] = useState("");     // m₀
  
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const resetForm = () => {
    setProperTime(""); setVelocity(""); setProperLength(""); setRestMass("");
    setResult(null);
    setCalcType("time_dilation");
  };

  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen]);

  useEffect(() => {
    resetForm(); // Reset all inputs when calcType changes for simplicity
  }, [calcType]);

  const lorentzFactor = (v: number): number => {
    if (Math.abs(v) >= SPEED_OF_LIGHT) throw new Error("Velocity cannot be >= c.");
    return 1 / Math.sqrt(1 - (v*v) / (SPEED_OF_LIGHT*SPEED_OF_LIGHT));
  };

  const handleCalculate = () => {
    let calculatedValue: number | null = null;
    let calculationDescription = "";
    let unit = "";
    const vNum = parseFloat(velocity);
    
    try {
      if (isNaN(vNum) && calcType !== 'energy_mass_equivalence') throw new Error("Velocity must be a valid number.");

      switch (calcType) {
        case "time_dilation": {
          const t0 = parseFloat(properTime);
          if (isNaN(t0)) throw new Error("Proper Time (t₀) must be a valid number.");
          const gamma = lorentzFactor(vNum);
          calculatedValue = gamma * t0;
          calculationDescription = "Dilated Time (t = γt₀)";
          unit = "s (or original time unit)";
          break;
        }
        case "length_contraction": {
          const l0 = parseFloat(properLength);
          if (isNaN(l0)) throw new Error("Proper Length (L₀) must be a valid number.");
          const gamma = lorentzFactor(vNum);
          calculatedValue = l0 / gamma;
          calculationDescription = "Contracted Length (L = L₀/γ)";
          unit = "m (or original length unit)";
          break;
        }
        case "relativistic_momentum": {
          const m0 = parseFloat(restMass);
          if (isNaN(m0)) throw new Error("Rest Mass (m₀) must be a valid number.");
          const gamma = lorentzFactor(vNum);
          calculatedValue = gamma * m0 * vNum;
          calculationDescription = "Relativistic Momentum (p = γm₀v)";
          unit = "kg·m/s";
          break;
        }
        case "energy_mass_equivalence": {
          const m = parseFloat(restMass); // Using restMass input field for mass 'm'
          if (isNaN(m)) throw new Error("Mass (m) must be a valid number.");
          calculatedValue = m * SPEED_OF_LIGHT * SPEED_OF_LIGHT;
          calculationDescription = "Energy (E = mc²)";
          unit = "J";
          break;
        }
        default:
          throw new Error("Invalid calculation type.");
      }
      setResult(`${calculationDescription}: ${calculatedValue?.toExponential(4)} ${unit}`);
    } catch (error: any) {
      setResult(`Error: ${error.message}`);
      toast({ variant: "destructive", title: "Calculation Error", description: error.message });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if(!open) resetForm(); onClose();}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Relativity Calculator</DialogTitle>
          <DialogDescription>
            Calculations for Special Relativity. (c ≈ {SPEED_OF_LIGHT.toExponential(4)} m/s)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="relativityCalcType" className="text-primary font-medium">Calculation Type:</Label>
            <Select value={calcType} onValueChange={(v) => setCalcType(v as CalculationType)}>
              <SelectTrigger id="relativityCalcType" className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="time_dilation">Time Dilation</SelectItem>
                <SelectItem value="length_contraction">Length Contraction</SelectItem>
                <SelectItem value="relativistic_momentum">Relativistic Momentum</SelectItem>
                <SelectItem value="energy_mass_equivalence">Energy-Mass Equivalence (E=mc²)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {calcType === "time_dilation" && (
            <>
              <div><Label htmlFor="properTime">Proper Time (t₀) <span className="text-xs text-muted-foreground">(s)</span></Label><Input id="properTime" type="number" value={properTime} onChange={e => setProperTime(e.target.value)} placeholder="e.g., 10" /></div>
              <div><Label htmlFor="velocityTD">Velocity (v) <span className="text-xs text-muted-foreground">(m/s)</span></Label><Input id="velocityTD" type="number" value={velocity} onChange={e => setVelocity(e.target.value)} placeholder="e.g., 0.5c = 1.5e8" /></div>
            </>
          )}
          {calcType === "length_contraction" && (
            <>
              <div><Label htmlFor="properLength">Proper Length (L₀) <span className="text-xs text-muted-foreground">(m)</span></Label><Input id="properLength" type="number" value={properLength} onChange={e => setProperLength(e.target.value)} placeholder="e.g., 100" /></div>
              <div><Label htmlFor="velocityLC">Velocity (v) <span className="text-xs text-muted-foreground">(m/s)</span></Label><Input id="velocityLC" type="number" value={velocity} onChange={e => setVelocity(e.target.value)} placeholder="e.g., 0.8c = 2.4e8" /></div>
            </>
          )}
          {calcType === "relativistic_momentum" && (
            <>
              <div><Label htmlFor="restMassRM">Rest Mass (m₀) <span className="text-xs text-muted-foreground">(kg)</span></Label><Input id="restMassRM" type="number" value={restMass} onChange={e => setRestMass(e.target.value)} placeholder="e.g., 1" /></div>
              <div><Label htmlFor="velocityRM">Velocity (v) <span className="text-xs text-muted-foreground">(m/s)</span></Label><Input id="velocityRM" type="number" value={velocity} onChange={e => setVelocity(e.target.value)} placeholder="e.g., 0.99c" /></div>
            </>
          )}
           {calcType === "energy_mass_equivalence" && (
            <>
              <div><Label htmlFor="massEME">Mass (m) <span className="text-xs text-muted-foreground">(kg)</span></Label><Input id="massEME" type="number" value={restMass} onChange={e => setRestMass(e.target.value)} placeholder="e.g., 1 (for E=mc²)" /></div>
            </>
          )}

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
