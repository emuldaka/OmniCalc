
// src/components/chemistry/molar-mass-calculator-dialog.tsx
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
import { elementsData } from "./periodic-table-data";
import { useToast } from "@/hooks/use-toast";

interface MolarMassCalculatorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const atomicMasses = new Map<string, number>();
elementsData.forEach(el => {
  if (typeof el.atomicMass === 'number') {
    atomicMasses.set(el.symbol, el.atomicMass);
  }
});

function parseSubFormula(formulaPart: string): Map<string, number> | null {
  const counts = new Map<string, number>();
  let i = 0;
  const n = formulaPart.length;

  while (i < n) {
    if (formulaPart[i] === '(') {
      let balance = 1;
      let j = i + 1;
      // Find matching parenthesis
      while (j < n && balance > 0) {
        if (formulaPart[j] === '(') balance++;
        else if (formulaPart[j] === ')') balance--;
        j++;
      }
      if (balance !== 0) return null; // Unbalanced parentheses

      const subSegment = formulaPart.substring(i + 1, j - 1);
      const subCounts = parseSubFormula(subSegment); // Recursive call
      if (!subCounts) return null;

      // Check for multiplier after parenthesis
      let multiplier = 1;
      let k = j;
      let numStr = "";
      while (k < n && /\d/.test(formulaPart[k])) {
        numStr += formulaPart[k];
        k++;
      }
      if (numStr) {
        multiplier = parseInt(numStr, 10);
        if (isNaN(multiplier)) return null; // Invalid multiplier
      }
      
      for (const [el, count] of subCounts) {
        counts.set(el, (counts.get(el) || 0) + count * multiplier);
      }
      i = k; // Move parser past the parenthesis and its multiplier
    } else if (/[A-Z]/.test(formulaPart[i])) {
      let elementSymbol = formulaPart[i];
      i++;
      if (i < n && /[a-z]/.test(formulaPart[i])) {
        elementSymbol += formulaPart[i];
        i++;
      }

      if (!atomicMasses.has(elementSymbol)) return null; // Unknown element

      let countStr = "";
      while (i < n && /\d/.test(formulaPart[i])) {
        countStr += formulaPart[i];
        i++;
      }
      const elementCount = countStr ? parseInt(countStr, 10) : 1;
      if (isNaN(elementCount)) return null; // Invalid count
      counts.set(elementSymbol, (counts.get(elementSymbol) || 0) + elementCount);
    } else {
      return null; // Invalid character
    }
  }
  return counts;
}

function parseFormula(formula: string): Map<string, number> | null {
  const overallCounts = new Map<string, number>();
  const formulaTrimmed = formula.replace(/\s+/g, ''); // Remove all whitespace

  // 1. Handle Hydrates (split by '·', '•', or '*')
  const hydrateParts = formulaTrimmed.split(/[·•*]/);
  const mainFormulaPart = hydrateParts[0];
  
  const mainCounts = parseSubFormula(mainFormulaPart);
  if (!mainCounts) return null;
  for (const [el, count] of mainCounts) {
    overallCounts.set(el, (overallCounts.get(el) || 0) + count);
  }

  if (hydrateParts.length > 1) {
    for (let k = 1; k < hydrateParts.length; k++) {
        let hydrateSegment = hydrateParts[k];
        let multiplier = 1;
        
        const multiplierMatch = hydrateSegment.match(/^(\d+)/);
        if (multiplierMatch) {
            multiplier = parseInt(multiplierMatch[1], 10);
            if (isNaN(multiplier)) return null; // Invalid multiplier
            hydrateSegment = hydrateSegment.substring(multiplierMatch[1].length);
        }
        
        const moleculeCounts = parseSubFormula(hydrateSegment);
        if (!moleculeCounts) return null;

        for (const [el, count] of moleculeCounts) {
            overallCounts.set(el, (overallCounts.get(el) || 0) + (count * multiplier));
        }
    }
  }

  return overallCounts.size > 0 ? overallCounts : (formula.trim() === "" ? new Map() : null);
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
      setResult(`Invalid formula, unknown element, or malformed structure in "${formula}".`);
      toast({ variant: "destructive", title: "Parsing Error", description: `Could not parse formula: ${formula}`});
      return;
    }

    let totalMolarMass = 0;
    for (const [element, count] of parsedElements) {
      totalMolarMass += (atomicMasses.get(element) || 0) * count;
    }
    
    if (totalMolarMass === 0 && parsedElements.size > 0) {
        setResult("Could not calculate molar mass. Ensure elements are valid and formula is structured correctly.");
    } else if (parsedElements.size === 0 && formula.trim() !== "") { // Should be caught by parseFormula returning null
        setResult("Invalid formula. Please check input.");
    } else {
        setResult(`Molar Mass of ${formula}: ${totalMolarMass.toFixed(3)} g/mol`);
    }
  };
  
  const resetForm = () => {
    setFormula("");
    setResult(null);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if(!open) resetForm(); onClose();}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Molar Mass Calculator</DialogTitle>
          <DialogDescription>
            Enter a chemical formula (e.g., H2O, Fe2(SO4)3, CuSO4·5H2O) to calculate its molar mass. Case-sensitive.
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
                setResult(null); 
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

