
// src/app/(app)/physics/page.tsx
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Atom, BookOpen, SigmaIcon, Binary, SlidersHorizontal, HelpCircle, Zap, Waves, Scaling } from 'lucide-react'; // Using some icons as placeholders
import { PhysicalConstantsDisplay } from '@/components/physics/physical-constants-display';
import { CommonFormulasSummary } from '@/components/physics/common-formulas-summary';
import { ParticlePhysicsDataDisplay } from '@/components/physics/particle-physics-data-display';
import { KinematicsCalculatorDialog } from '@/components/physics/kinematics-calculator-dialog';
import { ForceEnergyCalculatorDialog } from '@/components/physics/force-energy-calculator-dialog';
import { RelativityCalculatorDialog } from '@/components/physics/relativity-calculator-dialog';
import { OpticsCalculatorDialog } from '@/components/physics/optics-calculator-dialog';
import { ElectromagnetismCalculatorDialog } from '@/components/physics/electromagnetism-calculator-dialog';
import { Separator } from '@/components/ui/separator';

type ActivePhysicsDialog =
  | null
  | 'kinematics'
  | 'forceEnergy'
  | 'relativity'
  | 'optics'
  | 'electromagnetism';

export default function PhysicsPage() {
  const [activeDialog, setActiveDialog] = useState<ActivePhysicsDialog>(null);

  return (
    <div className="space-y-8">
      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-primary flex items-center">
            <Atom className="mr-4 h-10 w-10" /> Physics Hub
          </CardTitle>
          <CardDescription className="text-xl text-muted-foreground">
            Explore physical constants, common formulas, particle data, and utilize physics calculators.
          </CardDescription>
        </CardHeader>
      </Card>

      <PhysicalConstantsDisplay />
      <Separator className="my-10" />
      <CommonFormulasSummary />
      <Separator className="my-10" />
      <ParticlePhysicsDataDisplay />
      <Separator className="my-10" />

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl text-primary flex items-center">
            <SlidersHorizontal className="mr-3 h-8 w-8" /> Physics Calculators
          </CardTitle>
          <CardDescription className="text-lg">
            Tools for common physics calculations. Click a button to open the calculator.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button onClick={() => setActiveDialog('kinematics')} variant="outline" size="lg" className="h-auto py-4 text-base">
            Kinematics Calculator
          </Button>
          <Button onClick={() => setActiveDialog('forceEnergy')} variant="outline" size="lg" className="h-auto py-4 text-base">
            Force & Energy Calculator
          </Button>
          <Button onClick={() => setActiveDialog('relativity')} variant="outline" size="lg" className="h-auto py-4 text-base">
            Relativity Calculator
          </Button>
          <Button onClick={() => setActiveDialog('optics')} variant="outline" size="lg" className="h-auto py-4 text-base">
            Optics Calculator
          </Button>
          <Button onClick={() => setActiveDialog('electromagnetism')} variant="outline" size="lg" className="h-auto py-4 text-base">
            Electromagnetism Calculator
          </Button>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <KinematicsCalculatorDialog
        isOpen={activeDialog === 'kinematics'}
        onClose={() => setActiveDialog(null)}
      />
      <ForceEnergyCalculatorDialog
        isOpen={activeDialog === 'forceEnergy'}
        onClose={() => setActiveDialog(null)}
      />
      <RelativityCalculatorDialog
        isOpen={activeDialog === 'relativity'}
        onClose={() => setActiveDialog(null)}
      />
      <OpticsCalculatorDialog
        isOpen={activeDialog === 'optics'}
        onClose={() => setActiveDialog(null)}
      />
      <ElectromagnetismCalculatorDialog
        isOpen={activeDialog === 'electromagnetism'}
        onClose={() => setActiveDialog(null)}
      />
    </div>
  );
}
