// src/components/chemistry/stoichiometry-solver-dialog.tsx
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { solveStoichiometryProblem } from "@/actions/ai-actions"; // Updated import path
import type { StoichiometryInput, StoichiometryOutput, Reactant, TargetProduct, ActualYield } from "@/actions/ai-actions"; // Keep type imports
import { Loader2, PlusCircle, Trash2, Wand2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface StoichiometrySolverDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialReactant: Reactant = { formula: "", amount: 0, unit: "grams" };
const initialTargetProduct: TargetProduct = { formula: "", calculateVolume: false };

export function StoichiometrySolverDialog({ isOpen, onClose }: StoichiometrySolverDialogProps) {
  const [unbalancedEquation, setUnbalancedEquation] = useState("");
  const [reactants, setReactants] = useState<Reactant[]>([{ ...initialReactant }]);
  const [targetProducts, setTargetProducts] = useState<TargetProduct[]>([{ ...initialTargetProduct }]);
  const [actualYield, setActualYield] = useState<ActualYield | undefined>(undefined);

  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<StoichiometryOutput | null>(null);
  const { toast } = useToast();

  const handleAddReactant = () => {
    setReactants([...reactants, { ...initialReactant }]);
  };
  const handleRemoveReactant = (index: number) => {
    setReactants(reactants.filter((_, i) => i !== index));
  };
  const handleReactantChange = (index: number, field: keyof Reactant, value: any) => {
    const newReactants = [...reactants];
    const reactant = newReactants[index];
    if (field === 'amount' || field === 'pressure' || field === 'temperature') {
      (reactant[field] as any) = value === '' ? undefined : parseFloat(value);
    } else {
      (reactant[field] as any) = value;
    }
    setReactants(newReactants);
  };

  const handleAddTargetProduct = () => {
    setTargetProducts([...targetProducts, { ...initialTargetProduct }]);
  };
  const handleRemoveTargetProduct = (index: number) => {
    setTargetProducts(targetProducts.filter((_, i) => i !== index));
  };
  const handleTargetProductChange = (index: number, field: keyof TargetProduct, value: any) => {
    const newProducts = [...targetProducts];
     if (field === 'calculateVolume') {
      newProducts[index][field] = value as boolean;
    } else if (field === 'pressure' || field === 'temperature') {
      (newProducts[index][field] as any) = value === '' ? undefined : parseFloat(value);
    }
     else {
      (newProducts[index][field] as any) = value;
    }
    setTargetProducts(newProducts);
  };

  const handleActualYieldChange = (field: keyof ActualYield, value: any) => {
    setActualYield(prev => {
        const current = prev || { formula: "", amount: 0, unit: "grams" };
        if (field === 'amount') {
            return { ...current, [field]: value === '' ? undefined : parseFloat(value) };
        }
        return { ...current, [field]: value };
    });
  };


  const handleSubmit = async () => {
    // For static export, AI processing via server action is not available.
    toast({
      variant: "destructive",
      title: "AI Feature Unavailable",
      description: "AI-powered stoichiometry solving is not available in this static version of the app.",
      duration: 7000,
    });
    setResult({ errorMessage: "AI Stoichiometry Solver is unavailable in this version.", calculationLog: [] });

    // Original logic commented out:
    // if (!unbalancedEquation.trim()) {
    //   toast({ variant: "destructive", title: "Error", description: "Please enter a chemical equation." });
    //   return;
    // }
    // if (reactants.some(r => !r.formula.trim() || r.amount === undefined || r.amount <= 0)) {
    //   toast({ variant: "destructive", title: "Error", description: "Please provide valid formula and positive amount for all reactants." });
    //   return;
    // }
    //  if (targetProducts.some(p => !p.formula.trim()) && targetProducts.length > 0 && !(targetProducts.length === 1 && !targetProducts[0].formula)) {
    //   toast({ variant: "destructive", title: "Error", description: "Please provide a formula for all target products or remove empty ones." });
    //   return;
    // }

    // setIsProcessing(true);
    // setResult(null);

    // const input: StoichiometryInput = {
    //   unbalancedEquation,
    //   reactants: reactants.filter(r => r.formula.trim() && r.amount !== undefined && r.amount > 0),
    //   targetProducts: targetProducts.filter(tp => tp.formula.trim()),
    //   actualYield: (actualYield?.formula.trim() && actualYield.amount !== undefined && actualYield.amount > 0) ? actualYield : undefined,
    // };

    // try {
    //   const aiResult = await solveStoichiometryProblem(input);
    //   setResult(aiResult);
    //   if (aiResult.errorMessage) {
    //     toast({ variant: "destructive", title: "Calculation Error", description: aiResult.errorMessage, duration: 7000 });
    //   }
    // } catch (error) {
    //   console.error("Stoichiometry solving error:", error);
    //   toast({ variant: "destructive", title: "AI Error", description: "Failed to solve stoichiometry problem." });
    //   setResult({ errorMessage: "An unexpected error occurred while contacting the AI.", calculationLog: [] });
    // } finally {
    //   setIsProcessing(false);
    // }
  };

  const resetForm = () => {
    setUnbalancedEquation("");
    setReactants([{ ...initialReactant }]);
    setTargetProducts([{...initialTargetProduct}]);
    setActualYield(undefined);
    setResult(null);
    setIsProcessing(false);
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);


  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if(!open) resetForm(); onClose();}}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl">Advanced Stoichiometry Solver</DialogTitle>
          <DialogDescription>
            Enter equation, reactant amounts, and what to find.
            Gas conditions (P,V,T) can be specified for reactants/products. R = 0.08206 L·atm/mol·K.
            <span className="font-semibold text-destructive block mt-1">AI Solving features are unavailable in this static version.</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto min-h-0 py-4 px-6 space-y-6">
            <div>
              <Label htmlFor="unbalanced-equation" className="text-lg font-medium text-primary">Chemical Equation</Label>
              <Textarea
                id="unbalanced-equation"
                value={unbalancedEquation}
                onChange={(e) => setUnbalancedEquation(e.target.value)}
                placeholder="e.g., C3H8 + O2 -> CO2 + H2O"
                className="mt-1 min-h-[80px]"
              />
            </div>

            {/* Reactants Section */}
            <Card>
              <CardHeader>
                <Label className="text-lg font-medium text-primary">Reactants</Label>
              </CardHeader>
              <CardContent className="space-y-4">
                {reactants.map((reactant, index) => (
                  <Card key={index} className="p-4 space-y-3 bg-muted/30 relative">
                     {reactants.length > 1 && (
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => handleRemoveReactant(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                     )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label htmlFor={`reactant-formula-${index}`}>Formula</Label>
                        <Input id={`reactant-formula-${index}`} value={reactant.formula} onChange={(e) => handleReactantChange(index, 'formula', e.target.value)} placeholder="e.g., C3H8" />
                      </div>
                      <div>
                        <Label htmlFor={`reactant-amount-${index}`}>Amount</Label>
                        <Input id={`reactant-amount-${index}`} type="number" value={reactant.amount ?? ""} onChange={(e) => handleReactantChange(index, 'amount', e.target.value)} placeholder="e.g., 2.0" />
                      </div>
                      <div>
                        <Label htmlFor={`reactant-unit-${index}`}>Unit</Label>
                        <Select value={reactant.unit} onValueChange={(val) => handleReactantChange(index, 'unit', val)}>
                          <SelectTrigger id={`reactant-unit-${index}`}><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="grams">grams</SelectItem>
                            <SelectItem value="moles">moles</SelectItem>
                            <SelectItem value="liters">Liters (gas)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {reactant.unit === 'liters' && (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 border-t pt-3 mt-3">
                        <div>
                          <Label htmlFor={`reactant-pressure-${index}`}>Pressure</Label>
                          <Input id={`reactant-pressure-${index}`} type="number" value={reactant.pressure ?? ""} onChange={(e) => handleReactantChange(index, 'pressure', e.target.value)} placeholder="e.g., 1.0" />
                        </div>
                         <div>
                          <Label htmlFor={`reactant-pressure-unit-${index}`}>P Unit</Label>
                           <Select value={reactant.pressureUnit || "atm"} onValueChange={(val) => handleReactantChange(index, 'pressureUnit', val)}>
                            <SelectTrigger id={`reactant-pressure-unit-${index}`}><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="atm">atm</SelectItem>
                              <SelectItem value="kPa">kPa</SelectItem>
                              <SelectItem value="mmHg">mmHg</SelectItem>
                              <SelectItem value="torr">torr</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`reactant-temp-${index}`}>Temperature</Label>
                          <Input id={`reactant-temp-${index}`} type="number" value={reactant.temperature ?? ""} onChange={(e) => handleReactantChange(index, 'temperature', e.target.value)} placeholder="e.g., 298" />
                        </div>
                        <div>
                          <Label htmlFor={`reactant-temp-unit-${index}`}>T Unit</Label>
                          <Select value={reactant.temperatureUnit || "K"} onValueChange={(val) => handleReactantChange(index, 'temperatureUnit', val)}>
                            <SelectTrigger id={`reactant-temp-unit-${index}`}><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="K">K</SelectItem>
                              <SelectItem value="C">°C</SelectItem>
                              <SelectItem value="F">°F</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
                <Button variant="outline" onClick={handleAddReactant} className="w-full sm:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Reactant
                </Button>
              </CardContent>
            </Card>

            {/* Target Products Section */}
            <Card>
                <CardHeader>
                    <Label className="text-lg font-medium text-primary">Target Products (for Theoretical Yield)</Label>
                </CardHeader>
                <CardContent className="space-y-4">
                    {targetProducts.map((tp, index) => (
                        <Card key={`tp-${index}`} className="p-4 space-y-3 bg-muted/30 relative">
                            {targetProducts.length > 1 && (
                                <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => handleRemoveTargetProduct(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor={`tp-formula-${index}`}>Product Formula</Label>
                                    <Input id={`tp-formula-${index}`} value={tp.formula} onChange={(e) => handleTargetProductChange(index, 'formula', e.target.value)} placeholder="e.g., CO2" />
                                </div>
                                <div className="flex items-center pt-6">
                                   <Checkbox
                                        id={`tp-volume-${index}`}
                                        checked={tp.calculateVolume || false}
                                        onCheckedChange={(checked) => handleTargetProductChange(index, 'calculateVolume', !!checked)}
                                        className="mr-2 h-4 w-4 accent-primary"
                                    />
                                    <Label htmlFor={`tp-volume-${index}`} className="font-normal">
                                        Calculate Volume (if gas)
                                    </Label>
                                </div>
                            </div>
                             {tp.calculateVolume && (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 border-t pt-3 mt-3">
                                    <div>
                                        <Label htmlFor={`tp-pressure-${index}`}>Pressure for Volume</Label>
                                        <Input id={`tp-pressure-${index}`} type="number" value={tp.pressure ?? ""} onChange={(e) => handleTargetProductChange(index, 'pressure', e.target.value)} placeholder="e.g., 1.0 (optional)" />
                                    </div>
                                    <div>
                                        <Label htmlFor={`tp-pressure-unit-${index}`}>P Unit</Label>
                                        <Select value={tp.pressureUnit || "atm"} onValueChange={(val) => handleTargetProductChange(index, 'pressureUnit', val)}>
                                            <SelectTrigger id={`tp-pressure-unit-${index}`}><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="atm">atm</SelectItem><SelectItem value="kPa">kPa</SelectItem><SelectItem value="mmHg">mmHg</SelectItem><SelectItem value="torr">torr</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor={`tp-temp-${index}`}>Temp for Volume</Label>
                                        <Input id={`tp-temp-${index}`} type="number" value={tp.temperature ?? ""} onChange={(e) => handleTargetProductChange(index, 'temperature', e.target.value)} placeholder="e.g., 298 (optional)" />
                                    </div>
                                     <div>
                                        <Label htmlFor={`tp-temp-unit-${index}`}>T Unit</Label>
                                        <Select value={tp.temperatureUnit || "K"} onValueChange={(val) => handleTargetProductChange(index, 'temperatureUnit', val)}>
                                            <SelectTrigger id={`tp-temp-unit-${index}`}><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="K">K</SelectItem><SelectItem value="C">°C</SelectItem><SelectItem value="F">°F</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </Card>
                    ))}
                     <Button variant="outline" onClick={handleAddTargetProduct} className="w-full sm:w-auto">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Target Product
                    </Button>
                </CardContent>
            </Card>

            {/* Actual Yield Section */}
             <Card>
                <CardHeader>
                    <Label className="text-lg font-medium text-primary">Actual Yield (Optional - for % Yield)</Label>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
                     <div>
                        <Label htmlFor="actualyield-formula">Product Formula</Label>
                        <Input id="actualyield-formula" value={actualYield?.formula || ""} onChange={(e) => handleActualYieldChange('formula', e.target.value)} placeholder="e.g., NH3" />
                    </div>
                    <div>
                        <Label htmlFor="actualyield-amount">Amount</Label>
                        <Input id="actualyield-amount" type="number" value={actualYield?.amount ?? ""} onChange={(e) => handleActualYieldChange('amount', e.target.value)} placeholder="e.g., 15.0" />
                    </div>
                    <div>
                        <Label htmlFor="actualyield-unit">Unit</Label>
                        <Select value={actualYield?.unit || "grams"} onValueChange={(val) => handleActualYieldChange('unit', val as "grams" | "moles")}>
                            <SelectTrigger id="actualyield-unit"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="grams">grams</SelectItem>
                                <SelectItem value="moles">moles</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Button onClick={handleSubmit} disabled={isProcessing} className="w-full text-lg py-3">
              {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
              Solve with AI
            </Button>

            {/* Results Section */}
            {result && (
              <Card className="mt-6 shadow-inner">
                <CardHeader>
                  <Label className="text-xl font-semibold text-primary">Results</Label>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  {result.errorMessage && <p className="text-destructive font-semibold">Error: {result.errorMessage}</p>}

                  {result.balancedEquation && <p><span className="font-semibold">Balanced Equation:</span> <span className="font-mono bg-muted p-1 rounded">{result.balancedEquation}</span></p>}

                  {result.molarMassesUsed && Object.keys(result.molarMassesUsed).length > 0 && (
                    <div>
                        <p className="font-semibold">Molar Masses Used (g/mol):</p>
                        <ul className="list-disc list-inside pl-4">
                            {Object.entries(result.molarMassesUsed).map(([formula, mass]) => (
                                <li key={formula}><span className="font-mono">{formula}:</span> {mass.toFixed(3)}</li>
                            ))}
                        </ul>
                    </div>
                  )}

                  {result.limitingReactant && (
                    <p><span className="font-semibold">Limiting Reactant:</span> {result.limitingReactant.formula} ({result.limitingReactant.molesUsed.toFixed(4)} moles / {result.limitingReactant.gramsUsed.toFixed(3)} g used)</p>
                  )}

                  {result.excessReactants && result.excessReactants.length > 0 && (
                    <div>
                      <p className="font-semibold">Excess Reactant(s):</p>
                      <ul className="list-disc list-inside pl-4">
                        {result.excessReactants.map(er => (
                          <li key={er.formula}>
                            {er.formula}: {er.molesRemaining.toFixed(4)} moles / {er.gramsRemaining.toFixed(3)} g remaining (Initial: {er.molesInitial.toFixed(4)} moles / {er.gramsInitial.toFixed(3)} g)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.theoreticalYields && result.theoreticalYields.length > 0 && (
                    <div>
                      <p className="font-semibold">Theoretical Yield(s):</p>
                      <ul className="list-disc list-inside pl-4">
                        {result.theoreticalYields.map(ty => (
                          <li key={ty.formula}>
                            {ty.formula}: {ty.moles.toFixed(4)} moles
                            {ty.grams !== undefined && ` / ${ty.grams.toFixed(3)} g`}
                            {ty.liters !== undefined && ` / ${ty.liters.toFixed(3)} L`}
                            {ty.conditions && ` (${ty.conditions})`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.percentYield && (
                    <p><span className="font-semibold">Percent Yield ({result.percentYield.productFormula}):</span> {result.percentYield.percentage.toFixed(2)}%
                       (Actual: {result.percentYield.actualYieldGrams.toFixed(3)}g / Theoretical: {result.percentYield.theoreticalYieldGrams.toFixed(3)}g)
                    </p>
                  )}

                  {result.calculationLog && result.calculationLog.length > 0 && (
                    <div>
                      <p className="font-semibold mt-3">Calculation Log:</p>
                      <div className="h-[150px] w-full rounded-md border p-2 bg-muted/50 text-xs overflow-y-auto">
                        {result.calculationLog.map((log, i) => (
                          <p key={i} className="whitespace-pre-wrap">{log}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

        <DialogFooter className="flex-shrink-0 sm:justify-between pt-4 border-t">
          <Button type="button" variant="outline" onClick={resetForm}>Reset Form</Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
