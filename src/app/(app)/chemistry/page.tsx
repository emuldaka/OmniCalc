
// src/app/(app)/chemistry/page.tsx
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { FlaskConical, Atom, BookOpenCheck, ListChecks, CalculatorIcon as ChemistryCalculatorIcon } from 'lucide-react'; // Renamed to avoid conflict
import { PeriodicTableDisplay } from '@/components/chemistry/periodic-table-display';
import { ReactionTypesSummary } from '@/components/chemistry/reaction-types-summary';
import { BalancingEquationsGuide } from '@/components/chemistry/balancing-equations-guide';
import { MolarMassCalculatorDialog } from '@/components/chemistry/molar-mass-calculator-dialog';
import { StoichiometrySolverDialog } from '@/components/chemistry/stoichiometry-solver-dialog';
import { SolutionDilutionCalculatorDialog } from '@/components/chemistry/solution-dilution-calculator-dialog';
import { PhPohCalculatorDialog } from '@/components/chemistry/ph-poh-calculator-dialog';
import { Separator } from '@/components/ui/separator';

type ActiveDialog = 
  | null 
  | 'molarMass' 
  | 'stoichiometry' 
  | 'solutionDilution' 
  | 'phPoh';

export default function ChemistryPage() {
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);

  return (
    <div className="space-y-8">
      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-primary flex items-center">
            <FlaskConical className="mr-4 h-10 w-10" /> Chemistry Hub
          </CardTitle>
          <CardDescription className="text-xl text-muted-foreground">
            Explore elements, understand reactions, and utilize chemistry calculators.
          </CardDescription>
        </CardHeader>
      </Card>

      <PeriodicTableDisplay />

      <Separator className="my-10" />

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl text-primary flex items-center">
            <ChemistryCalculatorIcon className="mr-3 h-8 w-8" /> Chemistry Calculators
          </CardTitle>
          <CardDescription className="text-lg">
            Tools for common chemistry calculations. Click a button to open the calculator.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button onClick={() => setActiveDialog('molarMass')} variant="outline" size="lg" className="h-auto py-4 text-base">
            Molar Mass Calculator
          </Button>
          <Button onClick={() => setActiveDialog('stoichiometry')} variant="outline" size="lg" className="h-auto py-4 text-base">
            Stoichiometry Solver
          </Button>
          <Button onClick={() => setActiveDialog('solutionDilution')} variant="outline" size="lg" className="h-auto py-4 text-base">
            Solution Dilution Calculator
          </Button>
          <Button onClick={() => setActiveDialog('phPoh')} variant="outline" size="lg" className="h-auto py-4 text-base">
            pH / pOH Calculator
          </Button>
        </CardContent>
      </Card>
      
      <Separator className="my-10" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ReactionTypesSummary />
        <BalancingEquationsGuide />
      </div>

      {/* Dialogs */}
      <MolarMassCalculatorDialog 
        isOpen={activeDialog === 'molarMass'} 
        onClose={() => setActiveDialog(null)} 
      />
      <StoichiometrySolverDialog 
        isOpen={activeDialog === 'stoichiometry'} 
        onClose={() => setActiveDialog(null)} 
      />
      <SolutionDilutionCalculatorDialog 
        isOpen={activeDialog === 'solutionDilution'} 
        onClose={() => setActiveDialog(null)} 
      />
      <PhPohCalculatorDialog 
        isOpen={activeDialog === 'phPoh'} 
        onClose={() => setActiveDialog(null)} 
      />
    </div>
  );
}
