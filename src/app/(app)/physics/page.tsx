
// src/app/(app)/physics/page.tsx
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Atom, BookOpen, SigmaIcon, Binary, SlidersHorizontal, Zap, Waves, Scaling } from 'lucide-react';
import { PhysicalConstantsDisplay } from '@/components/physics/physical-constants-display';
import { CommonFormulasSummary } from '@/components/physics/common-formulas-summary';
import { ParticlePhysicsDataDisplay } from '@/components/physics/particle-physics-data-display';
import { KinematicsCalculatorDialog } from '@/components/physics/kinematics-calculator-dialog';
import { ForceEnergyCalculatorDialog } from '@/components/physics/force-energy-calculator-dialog';
import { RelativityCalculatorDialog } from '@/components/physics/relativity-calculator-dialog';
import { OpticsCalculatorDialog } from '@/components/physics/optics-calculator-dialog';
import { ElectromagnetismCalculatorDialog } from '@/components/physics/electromagnetism-calculator-dialog';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type ActivePhysicsDialog =
  | null
  | 'kinematics'
  | 'forceEnergy'
  | 'relativity'
  | 'optics'
  | 'electromagnetism'
  | 'whatGoesUp';

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
          <Button onClick={() => setActiveDialog('whatGoesUp')} variant="outline" size="lg" className="h-auto py-4 text-base">
            What Goes Up...
          </Button>
        </CardContent>
      </Card>
      
      <Separator className="my-10" />

      <Accordion type="multiple" collapsible className="w-full space-y-6">
        <AccordionItem value="constants">
          <AccordionTrigger className="text-2xl font-semibold text-primary hover:text-accent hover:no-underline p-4 rounded-lg data-[state=open]:bg-muted/50">
            <div className="flex items-center">
              <SigmaIcon className="mr-3 h-7 w-7" /> Physical Constants
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-0">
            <PhysicalConstantsDisplay />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="formulas">
          <AccordionTrigger className="text-2xl font-semibold text-primary hover:text-accent hover:no-underline p-4 rounded-lg data-[state=open]:bg-muted/50">
            <div className="flex items-center">
              <BookOpen className="mr-3 h-7 w-7" /> Common Physics Formulas
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-0">
            <CommonFormulasSummary />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="particles">
          <AccordionTrigger className="text-2xl font-semibold text-primary hover:text-accent hover:no-underline p-4 rounded-lg data-[state=open]:bg-muted/50">
            <div className="flex items-center">
              <Binary className="mr-3 h-7 w-7" /> Fundamental Particles & Particle Physics
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-0">
            <ParticlePhysicsDataDisplay />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      

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
      
      {/* "What Goes Up" Dialog */}
      <AlertDialog open={activeDialog === 'whatGoesUp'} onOpenChange={(open) => { if (!open) setActiveDialog(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
               A Universal Truth
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg py-4 text-center text-foreground">
              Must Come Down!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setActiveDialog(null)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
