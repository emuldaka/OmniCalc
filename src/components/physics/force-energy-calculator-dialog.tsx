
// src/components/physics/force-energy-calculator-dialog.tsx
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

interface ForceEnergyCalculatorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type CalculationType = 
  | "force_fma" // F = ma
  | "work_fd"   // W = Fd
  | "ke_mv2"    // KE = 0.5mv^2
  | "pe_mgh"    // PE = mgh
  | "power_wt"; // P = W/t

export function ForceEnergyCalculatorDialog({ isOpen, onClose }: ForceEnergyCalculatorDialogProps) {
  const [calcType, setCalcType] = useState<CalculationType>("force_fma");
  // Inputs for F=ma
  const [massFMA, setMassFMA] = useState("");
  const [accelerationFMA, setAccelerationFMA] = useState("");
  const [forceFMA, setForceFMA] = useState("");
  // Inputs for W=Fd
  const [forceWD, setForceWD] = useState("");
  const [displacementWD, setDisplacementWD] = useState("");
  const [workWD, setWorkWD] = useState("");
   // Inputs for KE=0.5mv^2
  const [massKE, setMassKE] = useState("");
  const [velocityKE, setVelocityKE] = useState("");
  const [kineticEnergyKE, setKineticEnergyKE] = useState("");
  // Inputs for PE=mgh
  const [massPE, setMassPE] = useState("");
  const [heightPE, setHeightPE] = useState("");
  const [potentialEnergyPE, setPotentialEnergyPE] = useState("");
  const GRAVITY_ACCEL = 9.80665; // m/s^2
  // Inputs for P=W/t
  const [workPT, setWorkPT] = useState("");
  const [timePT, setTimePT] = useState("");
  const [powerPT, setPowerPT] = useState("");

  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const resetForm = () => {
    setMassFMA(""); setAccelerationFMA(""); setForceFMA("");
    setForceWD(""); setDisplacementWD(""); setWorkWD("");
    setMassKE(""); setVelocityKE(""); setKineticEnergyKE("");
    setMassPE(""); setHeightPE(""); setPotentialEnergyPE("");
    setWorkPT(""); setTimePT(""); setPowerPT("");
    setResult(null);
    setCalcType("force_fma");
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  useEffect(() => { // Reset specific inputs when calcType changes
    resetForm();
  }, [calcType]);

  const handleCalculate = () => {
    let calculatedValue: number | null = null;
    let calculationDescription = "";
    let unit = "";

    try {
      switch (calcType) {
        case "force_fma": {
          const m = parseFloat(massFMA);
          const a = parseFloat(accelerationFMA);
          if (isNaN(m) || isNaN(a)) throw new Error("Mass and Acceleration must be valid numbers.");
          calculatedValue = m * a;
          setForceFMA(calculatedValue.toFixed(3));
          calculationDescription = "Force (F = ma)";
          unit = "N";
          break;
        }
        case "work_fd": {
          const f = parseFloat(forceWD);
          const d = parseFloat(displacementWD);
          if (isNaN(f) || isNaN(d)) throw new Error("Force and Displacement must be valid numbers.");
          calculatedValue = f * d; // Assuming angle is 0 for simplicity
          setWorkWD(calculatedValue.toFixed(3));
          calculationDescription = "Work (W = Fd)";
          unit = "J";
          break;
        }
        case "ke_mv2": {
            const m = parseFloat(massKE);
            const v = parseFloat(velocityKE);
            if (isNaN(m) || isNaN(v)) throw new Error("Mass and Velocity must be valid numbers.");
            calculatedValue = 0.5 * m * v * v;
            setKineticEnergyKE(calculatedValue.toFixed(3));
            calculationDescription = "Kinetic Energy (KE = ½mv²)";
            unit = "J";
            break;
        }
        case "pe_mgh": {
            const m = parseFloat(massPE);
            const h = parseFloat(heightPE);
            if (isNaN(m) || isNaN(h)) throw new Error("Mass and Height must be valid numbers.");
            calculatedValue = m * GRAVITY_ACCEL * h;
            setPotentialEnergyPE(calculatedValue.toFixed(3));
            calculationDescription = `Potential Energy (PE = mgh, g ≈ ${GRAVITY_ACCEL.toFixed(2)} m/s²)`;
            unit = "J";
            break;
        }
        case "power_wt": {
            const w = parseFloat(workPT);
            const t = parseFloat(timePT);
            if (isNaN(w) || isNaN(t)) throw new Error("Work and Time must be valid numbers.");
            if (t === 0) throw new Error("Time cannot be zero for power calculation.");
            calculatedValue = w / t;
            setPowerPT(calculatedValue.toFixed(3));
            calculationDescription = "Power (P = W/t)";
            unit = "W";
            break;
        }
        default:
          throw new Error("Invalid calculation type selected.");
      }
      setResult(`${calculationDescription}: ${calculatedValue?.toFixed(3)} ${unit}`);
    } catch (error: any) {
      setResult(`Error: ${error.message}`);
      toast({ variant: "destructive", title: "Calculation Error", description: error.message });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if(!open) resetForm(); onClose();}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Force & Energy Calculator</DialogTitle>
          <DialogDescription>
            Calculate Force (F=ma), Work (W=Fd), Kinetic Energy (KE=½mv²), Potential Energy (PE=mgh), or Power (P=W/t). Input known values.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="calcType" className="text-primary font-medium">Calculation Type:</Label>
            <Select value={calcType} onValueChange={(v) => setCalcType(v as CalculationType)}>
              <SelectTrigger id="calcType" className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="force_fma">Force (F = ma)</SelectItem>
                <SelectItem value="work_fd">Work (W = Fd)</SelectItem>
                <SelectItem value="ke_mv2">Kinetic Energy (KE = ½mv²)</SelectItem>
                <SelectItem value="pe_mgh">Potential Energy (PE = mgh)</SelectItem>
                <SelectItem value="power_wt">Power (P = W/t)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {calcType === "force_fma" && (
            <div className="grid grid-cols-2 gap-3">
              <div><Label htmlFor="massFMA">Mass (m) <span className="text-xs text-muted-foreground">(kg)</span></Label><Input id="massFMA" type="number" value={massFMA} onChange={e => setMassFMA(e.target.value)} placeholder="e.g., 10" /></div>
              <div><Label htmlFor="accelFMA">Acceleration (a) <span className="text-xs text-muted-foreground">(m/s²)</span></Label><Input id="accelFMA" type="number" value={accelerationFMA} onChange={e => setAccelerationFMA(e.target.value)} placeholder="e.g., 2" /></div>
              <div><Label htmlFor="forceFMA" className="text-primary">Force (F) <span className="text-xs text-muted-foreground">(N)</span></Label><Input id="forceFMA" type="number" value={forceFMA} readOnly placeholder="Result"/></div>
            </div>
          )}
          {calcType === "work_fd" && (
             <div className="grid grid-cols-2 gap-3">
              <div><Label htmlFor="forceWD">Force (F) <span className="text-xs text-muted-foreground">(N)</span></Label><Input id="forceWD" type="number" value={forceWD} onChange={e => setForceWD(e.target.value)} placeholder="e.g., 20" /></div>
              <div><Label htmlFor="dispWD">Displacement (d) <span className="text-xs text-muted-foreground">(m)</span></Label><Input id="dispWD" type="number" value={displacementWD} onChange={e => setDisplacementWD(e.target.value)} placeholder="e.g., 5" /></div>
              <div><Label htmlFor="workWD" className="text-primary">Work (W) <span className="text-xs text-muted-foreground">(J)</span></Label><Input id="workWD" type="number" value={workWD} readOnly placeholder="Result"/></div>
            </div>
          )}
           {calcType === "ke_mv2" && (
             <div className="grid grid-cols-2 gap-3">
              <div><Label htmlFor="massKE">Mass (m) <span className="text-xs text-muted-foreground">(kg)</span></Label><Input id="massKE" type="number" value={massKE} onChange={e => setMassKE(e.target.value)} placeholder="e.g., 2" /></div>
              <div><Label htmlFor="velKE">Velocity (v) <span className="text-xs text-muted-foreground">(m/s)</span></Label><Input id="velKE" type="number" value={velocityKE} onChange={e => setVelocityKE(e.target.value)} placeholder="e.g., 10" /></div>
              <div><Label htmlFor="kineticEnergyKE" className="text-primary">Kinetic Energy (KE) <span className="text-xs text-muted-foreground">(J)</span></Label><Input id="kineticEnergyKE" type="number" value={kineticEnergyKE} readOnly placeholder="Result"/></div>
            </div>
          )}
          {calcType === "pe_mgh" && (
             <div className="grid grid-cols-2 gap-3">
              <div><Label htmlFor="massPE">Mass (m) <span className="text-xs text-muted-foreground">(kg)</span></Label><Input id="massPE" type="number" value={massPE} onChange={e => setMassPE(e.target.value)} placeholder="e.g., 5" /></div>
              <div><Label htmlFor="heightPE">Height (h) <span className="text-xs text-muted-foreground">(m)</span></Label><Input id="heightPE" type="number" value={heightPE} onChange={e => setHeightPE(e.target.value)} placeholder="e.g., 10" /></div>
              <div><Label htmlFor="potentialEnergyPE" className="text-primary">Potential Energy (PE) <span className="text-xs text-muted-foreground">(J)</span></Label><Input id="potentialEnergyPE" type="number" value={potentialEnergyPE} readOnly placeholder="Result"/></div>
            </div>
          )}
          {calcType === "power_wt" && (
             <div className="grid grid-cols-2 gap-3">
              <div><Label htmlFor="workPT">Work (W) <span className="text-xs text-muted-foreground">(J)</span></Label><Input id="workPT" type="number" value={workPT} onChange={e => setWorkPT(e.target.value)} placeholder="e.g., 1000" /></div>
              <div><Label htmlFor="timePT">Time (t) <span className="text-xs text-muted-foreground">(s)</span></Label><Input id="timePT" type="number" value={timePT} onChange={e => setTimePT(e.target.value)} placeholder="e.g., 10" /></div>
              <div><Label htmlFor="powerPT" className="text-primary">Power (P) <span className="text-xs text-muted-foreground">(W)</span></Label><Input id="powerPT" type="number" value={powerPT} readOnly placeholder="Result"/></div>
            </div>
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
