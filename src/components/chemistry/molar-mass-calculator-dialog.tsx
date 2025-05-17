
// src/components/chemistry/molar-mass-calculator-dialog.tsx
"use client";

import { useState, useMemo } from "react";
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
import { elementsData } from "./periodic-table-data";
import { useToast } from "@/hooks/use-toast";

interface MolarMassCalculatorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// Create a map of element symbols to their atomic masses for quick lookup
const atomicMasses = new Map<string, number>();
elementsData.forEach(el => {
  if (typeof el.atomicMass === 'number') {
    atomicMasses.set(el.symbol, el.atomicMass);
  }
});

// Simple parser for chemical formulas (e.g., H2O, C6H12O6). Does not support parentheses.
function parseFormula(formula: string): Map<string, number> | null {
  const elementCounts = new Map<string, number>();
  // Regex to match element symbols (one uppercase, optional lowercase) and optional count
  const regex = /([A-Z][a-z]?)(\d*)/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(formula)) !== null) {
    if (match.index !== lastIndex) return null; // Invalid characters between parts

    const element = match[1];
    const count = parseInt(match[2] || "1", 10);

    if (!atomicMasses.has(element)) return null; // Unknown element

    elementCounts.set(element, (elementCounts.get(element) || 0) + count);
    lastIndex = regex.lastIndex;
  }
  
  if(lastIndex !== formula.length && formula.length > 0) return null; // Entire string not parsed

  return elementCounts.size > 0 ? elementCounts : (formula.trim() === "" ? new Map() : null);
}

export function MolarMassCalculatorDialog({ isOpen, onClose }: MolarMassCalculatorDialogProps) {
  const [formula, setFormula] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const calculateMolarMass = () => {
    if (!formula.trim()) {
      setResult("Please enter a chemical formula.");
      return;
    }

    const parsedElements = parseFormula(formula);

    if (!parsedElements) {
      setResult(`Invalid formula or unknown element in "${formula}". Check capitalization and ensure elements exist in the data.`);
      toast({ variant: "destructive", title: "Parsing Error", description: `Could not parse formula: ${formula}`});
      return;
    }

    let totalMolarMass = 0;
    for (const [element, count] of parsedElements) {
      totalMolarMass += (atomicMasses.get(element) || 0) * count;
    }
    
    if (totalMolarMass === 0 && parsedElements.size > 0) {
        setResult("Could not calculate molar mass. Ensure elements are valid.");
    } else if (parsedElements.size === 0 && formula.trim() !== "") {
        setResult("Invalid formula. Please check input.");
    }
     else {
        setResult(`Molar Mass of ${formula}: ${totalMolarMass.toFixed(3)} g/mol`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Molar Mass Calculator</DialogTitle>
          <DialogDescription>
            Enter a chemical formula (e.g., H2O, C6H12O6) to calculate its molar mass.
            Supports elements from the loaded periodic table data. Case-sensitive. No parentheses.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="chemical-formula" className="text-primary font-medium">
              Chemical Formula
            </Label>
            <Input
              id="chemical-formula"
              value={formula}
              onChange={(e) => {
                setFormula(e.target.value);
                setResult(null); // Clear previous result on input change
              }}
              placeholder="e.g., NaCl"
              className="mt-1"
            />
          </div>
          <Button onClick={calculateMolarMass} className="w-full">
            Calculate Molar Mass
          </Button>
          {result && (
            <div className="mt-4 p-3 bg-muted rounded-md text-center">
              <p className="font-semibold text-lg text-primary">{result}</p>
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
