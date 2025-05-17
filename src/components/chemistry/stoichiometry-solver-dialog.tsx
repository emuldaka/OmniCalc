
// src/components/chemistry/stoichiometry-solver-dialog.tsx
"use client";

import { useState } from "react";
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
import { elementsData } from "./periodic-table-data"; // For molar mass calculation

interface StoichiometrySolverDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const atomicMasses = new Map<string, number>();
elementsData.forEach(el => {
  if (typeof el.atomicMass === 'number') {
    atomicMasses.set(el.symbol, el.atomicMass);
  }
});

function parseFormulaForMolarMass(formula: string): number | null {
  const elementCounts = new Map<string, number>();
  const regex = /([A-Z][a-z]?)(\d*)/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(formula)) !== null) {
     if (match.index !== lastIndex) return null;
    const element = match[1];
    const count = parseInt(match[2] || "1", 10);
    if (!atomicMasses.has(element)) return null;
    elementCounts.set(element, (elementCounts.get(element) || 0) + count);
    lastIndex = regex.lastIndex;
  }
  if(lastIndex !== formula.length && formula.length > 0) return null; 

  if (elementCounts.size === 0 && formula.trim() !== "") return null;

  let totalMolarMass = 0;
  for (const [element, count] of elementCounts) {
    totalMolarMass += (atomicMasses.get(element) || 0) * count;
  }
  return totalMolarMass > 0 ? totalMolarMass : null;
}


export function StoichiometrySolverDialog({ isOpen, onClose }: StoichiometrySolverDialogProps) {
  const [formula, setFormula] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [conversionType, setConversionType] = useState<"gramsToMoles" | "molesToGrams">("gramsToMoles");
  const [result, setResult] = useState<string | null>(null);

  const handleCalculate = () => {
    const molarMass = parseFormulaForMolarMass(formula);
    if (!molarMass) {
      setResult("Invalid chemical formula or elements not found for molar mass.");
      return;
    }

    const value = parseFloat(inputValue);
    if (isNaN(value) || value < 0) {
      setResult("Invalid input value. Please enter a positive number.");
      return;
    }

    if (conversionType === "gramsToMoles") {
      const moles = value / molarMass;
      setResult(`${value} g of ${formula} is ${moles.toFixed(4)} moles. (Molar Mass: ${molarMass.toFixed(3)} g/mol)`);
    } else { // molesToGrams
      const grams = value * molarMass;
      setResult(`${value} moles of ${formula} is ${grams.toFixed(3)} g. (Molar Mass: ${molarMass.toFixed(3)} g/mol)`);
    }
  };
  
  const resetForm = () => {
    setFormula("");
    setInputValue("");
    setResult(null);
    setConversionType("gramsToMoles");
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if(!open) resetForm(); onClose();}}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Basic Stoichiometry Calculator</DialogTitle>
          <DialogDescription>
            Convert between grams and moles for a single substance.
            Full reaction stoichiometry is not yet supported.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="stoich-formula" className="text-primary font-medium">Chemical Formula</Label>
            <Input
              id="stoich-formula"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder="e.g., H2O"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="stoich-conversion-type" className="text-primary font-medium">Conversion Type</Label>
            <Select value={conversionType} onValueChange={(v) => setConversionType(v as any)}>
              <SelectTrigger id="stoich-conversion-type" className="mt-1">
                <SelectValue placeholder="Select conversion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gramsToMoles">Grams to Moles</SelectItem>
                <SelectItem value="molesToGrams">Moles to Grams</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="stoich-input-value" className="text-primary font-medium">
              {conversionType === "gramsToMoles" ? "Mass (grams)" : "Amount (moles)"}
            </Label>
            <Input
              id="stoich-input-value"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="mt-1"
            />
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
