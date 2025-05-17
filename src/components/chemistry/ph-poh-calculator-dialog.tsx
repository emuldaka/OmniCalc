
// src/components/chemistry/ph-poh-calculator-dialog.tsx
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

interface PhPohCalculatorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type InputType = 
  | "pH" 
  | "pOH" 
  | "H_concentration" 
  | "OH_concentration"
  | "weak_acid_conc_Ka"
  | "weak_base_conc_Kb";

type TemperatureUnit = 'C' | 'K' | 'F';

// Function to calculate pKw based on temperature in Kelvin
// Formula from: N.S. Nageshwara Rao, J. Chem. Educ., 2001, 78(1), 95
const getPKw = (tempInKelvin: number): number => {
  if (tempInKelvin <= 0) return 14; // Default or error case
  return (4470.99 / tempInKelvin) - 6.0875 + (0.01706 * tempInKelvin);
};

const convertToKelvin = (value: number, unit: TemperatureUnit): number => {
  switch (unit) {
    case 'C':
      return value + 273.15;
    case 'F':
      return (value - 32) * 5/9 + 273.15;
    case 'K':
      return value;
    default:
      return 298.15; // Default to 25°C if unit is unknown
  }
};


export function PhPohCalculatorDialog({ isOpen, onClose }: PhPohCalculatorDialogProps) {
  const [inputType, setInputType] = useState<InputType>("pH");
  const [inputValue, setInputValue] = useState("");
  const [initialConcentration, setInitialConcentration] = useState("");
  const [dissociationConstant, setDissociationConstant] = useState(""); // For Ka or Kb
  
  const [temperatureValue, setTemperatureValue] = useState("25");
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>("C");

  const [results, setResults] = useState<{ pH?: string; pOH?: string; H?: string; OH?: string; pKwUsed?: string; error?: string } | null>(null);

  const calculateAll = () => {
    const val = parseFloat(inputValue);
    const C0 = parseFloat(initialConcentration); 
    const K_diss = parseFloat(dissociationConstant); 
    const tempNum = parseFloat(temperatureValue);

    if (isNaN(tempNum)) {
      setResults({ error: "Invalid temperature value." });
      return;
    }

    const tempK = convertToKelvin(tempNum, temperatureUnit);
    if (tempK <= 0) {
        setResults({error: "Temperature must be above absolute zero."});
        return;
    }
    const pKw = getPKw(tempK);

    let pH: number | undefined, pOH: number | undefined, H_conc: number | undefined, OH_conc: number | undefined;
    let errorMsg: string | undefined;

    try {
      switch (inputType) {
        case "pH":
          if (isNaN(val)) { errorMsg = "Invalid input value for pH."; break; }
          // pH theoretical limits can exceed 0-pKw range for superacids/bases
          pH = val;
          pOH = pKw - pH;
          H_conc = Math.pow(10, -pH);
          OH_conc = Math.pow(10, -pOH);
          break;
        case "pOH":
          if (isNaN(val)) { errorMsg = "Invalid input value for pOH."; break; }
          pOH = val;
          pH = pKw - pOH;
          H_conc = Math.pow(10, -pH);
          OH_conc = Math.pow(10, -pOH);
          break;
        case "H_concentration":
          if (isNaN(val)) { errorMsg = "Invalid input value for [H⁺]."; break; }
          if (val <= 0) { errorMsg = "[H⁺] concentration must be positive."; break;}
          H_conc = val;
          pH = -Math.log10(H_conc);
          pOH = pKw - pH;
          OH_conc = Math.pow(10, -pOH);
          break;
        case "OH_concentration":
          if (isNaN(val)) { errorMsg = "Invalid input value for [OH⁻]."; break; }
          if (val <= 0) { errorMsg = "[OH⁻] concentration must be positive."; break;}
          OH_conc = val;
          pOH = -Math.log10(OH_conc);
          pH = pKw - pOH;
          H_conc = Math.pow(10, -pH);
          break;
        case "weak_acid_conc_Ka":
          if (isNaN(C0) || isNaN(K_diss)) { errorMsg = "Invalid input for C₀ or Ka."; break; }
          if (C0 <= 0 || K_diss <= 0) { errorMsg = "Initial concentration and Ka must be positive."; break; }
          const discriminant_Ka = Math.pow(K_diss, 2) + 4 * K_diss * C0;
          if (discriminant_Ka < 0) { errorMsg = "Cannot calculate [H⁺] (negative discriminant)."; break; }
          H_conc = (-K_diss + Math.sqrt(discriminant_Ka)) / 2;
          if (H_conc <= 0 || isNaN(H_conc)) { errorMsg = "Calculated [H⁺] is not positive or valid."; break; }
          pH = -Math.log10(H_conc);
          pOH = pKw - pH;
          OH_conc = Math.pow(10, -pOH);
          break;
        case "weak_base_conc_Kb":
          if (isNaN(C0) || isNaN(K_diss)) { errorMsg = "Invalid input for C₀ or Kb."; break; }
          if (C0 <= 0 || K_diss <= 0) { errorMsg = "Initial concentration and Kb must be positive."; break; }
          const discriminant_Kb = Math.pow(K_diss, 2) + 4 * K_diss * C0;
          if (discriminant_Kb < 0) { errorMsg = "Cannot calculate [OH⁻] (negative discriminant)."; break; }
          OH_conc = (-K_diss + Math.sqrt(discriminant_Kb)) / 2;
          if (OH_conc <= 0 || isNaN(OH_conc)) { errorMsg = "Calculated [OH⁻] is not positive or valid."; break; }
          pOH = -Math.log10(OH_conc);
          pH = pKw - pOH;
          H_conc = Math.pow(10, -pH);
          break;
        default:
          errorMsg = "Invalid input type selected.";
      }

      if (errorMsg) {
        setResults({ error: errorMsg });
      } else {
        setResults({
          pH: pH?.toPrecision(3),
          pOH: pOH?.toPrecision(3),
          H: H_conc?.toExponential(2),
          OH: OH_conc?.toExponential(2),
          pKwUsed: pKw.toPrecision(4),
        });
      }
    } catch (e) {
      setResults({ error: "Calculation error occurred." });
    }
  };

  const resetForm = () => {
    setInputValue("");
    setInitialConcentration("");
    setDissociationConstant("");
    setTemperatureValue("25");
    setTemperatureUnit("C");
    setResults(null);
    setInputType("pH");
  }
  
  useEffect(() => {
    setInputValue("");
    setInitialConcentration("");
    setDissociationConstant("");
    setTemperatureValue("25"); // Reset temperature to default on type change
    setTemperatureUnit("C");
    setResults(null);
  }, [inputType]);

  const isWeakAcidOrBase = inputType === "weak_acid_conc_Ka" || inputType === "weak_base_conc_Kb";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if(!open) resetForm(); onClose();}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>pH / pOH Calculator</DialogTitle>
          <DialogDescription>
            Calculate pH, pOH, [H⁺], and [OH⁻] based on the selected input type and temperature.
            For weak acids/bases, provide C₀ and Ka/Kb.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
                <Label htmlFor="temperatureValue" className="text-primary font-medium">Temperature</Label>
                <Input
                    id="temperatureValue"
                    type="number"
                    value={temperatureValue}
                    onChange={(e) => setTemperatureValue(e.target.value)}
                    className="mt-1"
                />
            </div>
            <div>
                <Label htmlFor="temperatureUnit" className="text-primary font-medium">Unit</Label>
                 <Select value={temperatureUnit} onValueChange={(v) => setTemperatureUnit(v as TemperatureUnit)}>
                    <SelectTrigger id="temperatureUnit" className="mt-1">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="C">°C</SelectItem>
                        <SelectItem value="K">K</SelectItem>
                        <SelectItem value="F">°F</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="inputType" className="text-primary font-medium">Calculate From:</Label>
            <Select value={inputType} onValueChange={(v) => setInputType(v as InputType)}>
              <SelectTrigger id="inputType" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pH">pH</SelectItem>
                <SelectItem value="pOH">pOH</SelectItem>
                <SelectItem value="H_concentration">[H⁺] Concentration (M)</SelectItem>
                <SelectItem value="OH_concentration">[OH⁻] Concentration (M)</SelectItem>
                <SelectItem value="weak_acid_conc_Ka">Weak Acid (C₀ & Ka)</SelectItem>
                <SelectItem value="weak_base_conc_Kb">Weak Base (C₀ & Kb)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!isWeakAcidOrBase && (
            <div>
              <Label htmlFor="inputValue" className="text-primary font-medium">Input Value:</Label>
              <Input
                id="inputValue"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Enter ${inputType.replace(/_/g, " ")}`}
                className="mt-1"
              />
            </div>
          )}

          {isWeakAcidOrBase && (
            <>
              <div>
                <Label htmlFor="initialConcentration" className="text-primary font-medium">Initial Concentration (C₀ in M):</Label>
                <Input
                  id="initialConcentration"
                  type="number"
                  value={initialConcentration}
                  onChange={(e) => setInitialConcentration(e.target.value)}
                  placeholder="e.g., 0.1"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dissociationConstant" className="text-primary font-medium">
                  {inputType === "weak_acid_conc_Ka" ? "Acid Dissociation Constant (Ka):" : "Base Dissociation Constant (Kb):"}
                </Label>
                <Input
                  id="dissociationConstant"
                  type="number"
                  value={dissociationConstant}
                  onChange={(e) => setDissociationConstant(e.target.value)}
                  placeholder={inputType === "weak_acid_conc_Ka" ? "e.g., 1.8e-5" : "e.g., 1.8e-5"}
                  className="mt-1"
                />
              </div>
            </>
          )}

          <Button onClick={calculateAll} className="w-full">Calculate</Button>
          {results && (
            <div className="mt-4 p-3 bg-muted rounded-md space-y-2">
              {results.error && <p className="text-destructive font-semibold text-center">{results.error}</p>}
              {results.pH && <p><span className="font-semibold text-primary">pH:</span> {results.pH}</p>}
              {results.pOH && <p><span className="font-semibold text-primary">pOH:</span> {results.pOH}</p>}
              {results.H && <p><span className="font-semibold text-primary">[H⁺]:</span> {results.H} M</p>}
              {results.OH && <p><span className="font-semibold text-primary">[OH⁻]:</span> {results.OH} M</p>}
              {results.pKwUsed && <p className="text-xs text-muted-foreground text-center">(Calculations performed using pK<sub>w</sub> = {results.pKwUsed} at the specified temperature)</p>}
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

