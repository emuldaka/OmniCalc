
// src/components/physics/common-formulas-summary.tsx
"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface FormulaItem {
  id: string;
  name: string;
  formula: string; // Can include simple LaTeX-like syntax if needed, or just plain text
  variables: string;
  description: string;
  example?: string;
}

const formulas: FormulaItem[] = [
  {
    id: 'newton_second_law',
    name: "Newton's Second Law of Motion",
    formula: "F = ma",
    variables: "F: Force, m: mass, a: acceleration",
    description: "The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.",
    example: "A 10 kg object accelerating at 2 m/s² experiences a force of F = 10 kg × 2 m/s² = 20 N."
  },
  {
    id: 'kinematic_vf_vi_at',
    name: "Kinematics: Final Velocity (Constant Accel.)",
    formula: "v_f = v_i + at",
    variables: "v_f: final velocity, v_i: initial velocity, a: acceleration, t: time",
    description: "Calculates the final velocity of an object undergoing constant acceleration.",
  },
  {
    id: 'kinematic_s_ut_half_at_sq',
    name: "Kinematics: Displacement (Constant Accel.)",
    formula: "s = v_i t + (1/2)at²",
    variables: "s: displacement, v_i: initial velocity, t: time, a: acceleration",
    description: "Calculates the displacement of an object undergoing constant acceleration.",
  },
  {
    id: 'kinetic_energy',
    name: "Kinetic Energy",
    formula: "KE = (1/2)mv²",
    variables: "KE: kinetic energy, m: mass, v: velocity",
    description: "The energy an object possesses due to its motion.",
  },
  {
    id: 'potential_energy_grav',
    name: "Gravitational Potential Energy",
    formula: "PE = mgh",
    variables: "PE: potential energy, m: mass, g: acceleration due to gravity (approx. 9.81 m/s²), h: height",
    description: "The energy an object possesses due to its position in a gravitational field.",
  },
  {
    id: 'ideal_gas_law',
    name: "Ideal Gas Law",
    formula: "PV = nRT",
    variables: "P: pressure, V: volume, n: number of moles, R: ideal gas constant, T: temperature (Kelvin)",
    description: "Describes the state of an ideal gas under given conditions.",
  },
  {
    id: 'work_done',
    name: "Work Done by a Constant Force",
    formula: "W = Fd cos(θ)",
    variables: "W: work, F: force, d: displacement, θ: angle between force and displacement vectors",
    description: "The energy transferred to or from an object via the application of force along a displacement.",
  },
];


export function CommonFormulasSummary() {
  return (
    <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="text-2xl text-primary flex items-center">
                <BookOpen className="mr-3 h-7 w-7"/> Common Physics Formulas
            </CardTitle>
            <CardDescription>
                A quick summary of key equations in physics.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full">
                {formulas.map((item) => (
                    <AccordionItem value={item.id} key={item.id}>
                        <AccordionTrigger className="text-lg hover:text-accent">{item.name}</AccordionTrigger>
                        <AccordionContent className="text-base space-y-2">
                            <p className="font-mono text-md p-2 bg-muted rounded inline-block">{item.formula}</p>
                            <p><strong>Variables:</strong> {item.variables}</p>
                            <p>{item.description}</p>
                            {item.example && <p className="italic"><strong className="not-italic">Example:</strong> {item.example}</p>}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </CardContent>
    </Card>
  );
}
