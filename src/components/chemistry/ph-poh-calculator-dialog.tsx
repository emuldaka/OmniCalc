
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

type InputType = "pH" | "pOH" | "H_concentration" | "OH_concentration";

export function PhPohCalculatorDialog({ isOpen, onClose }: PhPohCalculatorDialogProps) {
  const [inputType, setInputType] = useState<InputType>("pH");
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState<{ pH?: string; pOH?: string; H?: string; OH?: string; error?: string } | null>(null);

  const calculateAll = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) {
      setResults({ error: "Invalid input value. Please enter a number." });
      return;
    }

    let pH: number | undefined, pOH: number | undefined, H_conc: number | undefined, OH_conc: number | undefined;
    let errorMsg: string | undefined;

    try {
      switch (inputType) {
        case "pH":
          if (val < 0 || val > 14) errorMsg = "pH must be between 0 and 14.";
          pH = val;
          pOH = 14 - pH;
          H_conc = Math.pow(10, -pH);
          OH_conc = Math.pow(10, -pOH);
          break;
        case "pOH":
          if (val < 0 || val > 14) errorMsg = "pOH must be between 0 and 14.";
          pOH = val;
          pH = 14 - pOH;
          H_conc = Math.pow(10, -pH);
          OH_conc = Math.pow(10, -pOH);
          break;
        case "H_concentration":
          if (val <= 0) errorMsg = "[H⁺] concentration must be positive.";
          H_conc = val;
          pH = -Math.log10(H_conc);
          if (pH < 0 || pH > 14) errorMsg = errorMsg || "Calculated pH out of typical range (0-14).";
          pOH = 14 - pH;
          OH_conc = Math.pow(10, -pOH);
          break;
        case "OH_concentration":
          if (val <= 0) errorMsg = "[OH⁻] concentration must be positive.";
          OH_conc = val;
          pOH = -Math.log10(OH_conc);
          if (pOH < 0 || pOH > 14) errorMsg = errorMsg || "Calculated pOH out of typical range (0-14).";
          pH = 14 - pOH;
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
        });
      }
    } catch (e) {
      setResults({ error: "Calculation error occurred." });
    }
  };

  const resetForm = () => {
    setInputValue("");
    setResults(null);
    setInputType("pH");
  }
  
  useEffect(() => {
    setInputValue(""); // Clear input when type changes
    setResults(null);
  }, [inputType]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if(!open) resetForm(); onClose();}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>pH / pOH Calculator</DialogTitle>
          <DialogDescription>
            Enter one value to calculate pH, pOH, [H⁺], and [OH⁻]. Assumes 25°C.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="inputType" className="text-primary font-medium">Input Type:</Label>
            <Select value={inputType} onValueChange={(v) => setInputType(v as InputType)}>
              <SelectTrigger id="inputType" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pH">pH</SelectItem>
                <SelectItem value="pOH">pOH</SelectItem>
                <SelectItem value="H_concentration">[H⁺] Concentration (M)</SelectItem>
                <SelectItem value="OH_concentration">[OH⁻] Concentration (M)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="inputValue" className="text-primary font-medium">Input Value:</Label>
            <Input
              id="inputValue"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Enter ${inputType}`}
              className="mt-1"
            />
          </div>
          <Button onClick={calculateAll} className="w-full">Calculate</Button>
          {results && (
            <div className="mt-4 p-3 bg-muted rounded-md space-y-2">
              {results.error && <p className="text-destructive font-semibold text-center">{results.error}</p>}
              {results.pH && <p><span className="font-semibold text-primary">pH:</span> {results.pH}</p>}
              {results.pOH && <p><span className="font-semibold text-primary">pOH:</span> {results.pOH}</p>}
              {results.H && <p><span className="font-semibold text-primary">[H⁺]:</span> {results.H} M</p>}
              {results.OH && <p><span className="font-semibold text-primary">[OH⁻]:</span> {results.OH} M</p>}
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
