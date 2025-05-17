
// src/components/physics/electromagnetism-calculator-dialog.tsx
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

const COULOMB_CONSTANT_K = 1 / (4 * Math.PI * (physicalConstantsData.find(c=>c.id==='eps0')?.value || 8.854e-12) ); // k ≈ 8.9875e9 N·m²/C²
const ELEMENTARY_CHARGE_E = physicalConstantsData.find(c=>c.id==='e')?.value || 1.602e-19; // C

interface ElectromagnetismCalculatorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type CalculationType = 
  | "coulombs_law_force" // F = k|q1q2|/r^2
  | "electric_field_point_charge" // E = kq/r^2
  | "electric_potential_point_charge" // V = kq/r
  | "capacitance_q_v"; // C = Q/V

export function ElectromagnetismCalculatorDialog({ isOpen, onClose }: ElectromagnetismCalculatorDialogProps) {
  const [calcType, setCalcType] = useState<CalculationType>("coulombs_law_force");
  // Inputs
  const [charge1, setCharge1] = useState("");
  const [charge2, setCharge2] = useState("");
  const [distanceR, setDistanceR] = useState("");
  const [chargeQ, setChargeQ] = useState(""); // General charge for E-field, Potential, Capacitance
  const [voltageV, setVoltageV] = useState(""); // For Capacitance

  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const resetForm = () => {
    setCharge1(""); setCharge2(""); setDistanceR(""); setChargeQ(""); setVoltageV("");
    setResult(null);
    setCalcType("coulombs_law_force");
  };

  useEffect(() => { if (!isOpen) resetForm(); }, [isOpen]);
  useEffect(() => { resetForm(); }, [calcType]);

  const handleCalculate = () => {
    let calculatedValue: number | null = null;
    let calculationDescription = "";
    let unit = "";

    try {
      switch (calcType) {
        case "coulombs_law_force": {
          const q1 = parseFloat(charge1);
          const q2 = parseFloat(charge2);
          const r = parseFloat(distanceR);
          if (isNaN(q1) || isNaN(q2) || isNaN(r)) throw new Error("Charges and Distance must be valid numbers.");
          if (r === 0) throw new Error("Distance (r) cannot be zero.");
          calculatedValue = COULOMB_CONSTANT_K * Math.abs(q1 * q2) / (r * r);
          calculationDescription = "Coulomb's Force (F = k|q₁q₂|/r²)";
          unit = "N";
          break;
        }
        case "electric_field_point_charge": {
          const Q = parseFloat(chargeQ);
          const r = parseFloat(distanceR);
          if (isNaN(Q) || isNaN(r)) throw new Error("Charge (Q) and Distance (r) must be valid numbers.");
          if (r === 0) throw new Error("Distance (r) cannot be zero.");
          calculatedValue = COULOMB_CONSTANT_K * Math.abs(Q) / (r * r);
          calculationDescription = "Electric Field (E = k|Q|/r²)";
          unit = "N/C";
          break;
        }
        case "electric_potential_point_charge": {
          const Q = parseFloat(chargeQ);
          const r = parseFloat(distanceR);
          if (isNaN(Q) || isNaN(r)) throw new Error("Charge (Q) and Distance (r) must be valid numbers.");
          if (r === 0) throw new Error("Distance (r) cannot be zero for potential (conventionally V=∞ at r=0).");
          calculatedValue = COULOMB_CONSTANT_K * Q / r;
          calculationDescription = "Electric Potential (V = kQ/r)";
          unit = "V";
          break;
        }
        case "capacitance_q_v": {
          const Q_cap = parseFloat(chargeQ); // Using chargeQ field for Q in C=Q/V
          const V_cap = parseFloat(voltageV);
          if (isNaN(Q_cap) || isNaN(V_cap)) throw new Error("Charge (Q) and Voltage (V) must be valid numbers.");
          if (V_cap === 0 && Q_cap !== 0) throw new Error("Voltage (V) cannot be zero if Charge (Q) is non-zero for capacitance calculation.");
          if (V_cap === 0 && Q_cap === 0) { // 0/0 case
             calculatedValue = 0; // Or undefined, depending on convention
          } else {
             calculatedValue = Q_cap / V_cap;
          }
          calculationDescription = "Capacitance (C = Q/V)";
          unit = "F (Farads)";
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
          <DialogTitle>Electromagnetism Calculator</DialogTitle>
          <DialogDescription>
            Basic electrostatic calculations. (k ≈ {COULOMB_CONSTANT_K.toExponential(4)} N·m²/C²)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="emCalcType" className="text-primary font-medium">Calculation Type:</Label>
            <Select value={calcType} onValueChange={(v) => setCalcType(v as CalculationType)}>
              <SelectTrigger id="emCalcType" className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="coulombs_law_force">Coulomb's Law (Force)</SelectItem>
                <SelectItem value="electric_field_point_charge">Electric Field (Point Charge)</SelectItem>
                <SelectItem value="electric_potential_point_charge">Electric Potential (Point Charge)</SelectItem>
                <SelectItem value="capacitance_q_v">Capacitance (C = Q/V)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {calcType === "coulombs_law_force" && (
            <>
              <div><Label htmlFor="charge1CL">Charge 1 (q₁) <span className="text-xs text-muted-foreground">(C)</span></Label><Input id="charge1CL" type="number" value={charge1} onChange={e => setCharge1(e.target.value)} placeholder="e.g., 1.6e-19" /></div>
              <div><Label htmlFor="charge2CL">Charge 2 (q₂) <span className="text-xs text-muted-foreground">(C)</span></Label><Input id="charge2CL" type="number" value={charge2} onChange={e => setCharge2(e.target.value)} placeholder="e.g., -1.6e-19" /></div>
              <div><Label htmlFor="distanceRCL">Distance (r) <span className="text-xs text-muted-foreground">(m)</span></Label><Input id="distanceRCL" type="number" value={distanceR} onChange={e => setDistanceR(e.target.value)} placeholder="e.g., 1e-10" /></div>
            </>
          )}
          {(calcType === "electric_field_point_charge" || calcType === "electric_potential_point_charge") && (
            <>
              <div><Label htmlFor="chargeQEP">Charge (Q) <span className="text-xs text-muted-foreground">(C)</span></Label><Input id="chargeQEP" type="number" value={chargeQ} onChange={e => setChargeQ(e.target.value)} placeholder="e.g., 1e-9" /></div>
              <div><Label htmlFor="distanceREP">Distance (r) <span className="text-xs text-muted-foreground">(m)</span></Label><Input id="distanceREP" type="number" value={distanceR} onChange={e => setDistanceR(e.target.value)} placeholder="e.g., 0.1" /></div>
            </>
          )}
           {calcType === "capacitance_q_v" && (
            <>
              <div><Label htmlFor="chargeQCap">Charge (Q) <span className="text-xs text-muted-foreground">(C)</span></Label><Input id="chargeQCap" type="number" value={chargeQ} onChange={e => setChargeQ(e.target.value)} placeholder="e.g., 1e-6" /></div>
              <div><Label htmlFor="voltageVCap">Voltage (V) <span className="text-xs text-muted-foreground">(V)</span></Label><Input id="voltageVCap" type="number" value={voltageV} onChange={e => setVoltageV(e.target.value)} placeholder="e.g., 12" /></div>
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
