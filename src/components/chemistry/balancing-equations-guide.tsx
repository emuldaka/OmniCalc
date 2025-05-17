
// src/components/chemistry/balancing-equations-guide.tsx
"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenCheck } from "lucide-react";


export function BalancingEquationsGuide() {
  return (
    <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="text-2xl text-primary flex items-center">
                <BookOpenCheck className="mr-3 h-7 w-7"/> Quick Guide to Balancing Chemical Equations
            </CardTitle>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="step1">
                    <AccordionTrigger className="text-lg hover:text-accent">Step 1: Write the Unbalanced Equation</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                    <p>Identify the reactants (starting materials) and products (substances formed). Write their chemical formulas correctly.</p>
                    <p><strong>Example:</strong> Reaction of methane (CH₄) with oxygen (O₂) to form carbon dioxide (CO₂) and water (H₂O).</p>
                    <p className="font-mono text-sm p-2 bg-muted rounded">Unbalanced: CH₄ + O₂ → CO₂ + H₂O</p>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="step2">
                    <AccordionTrigger className="text-lg hover:text-accent">Step 2: Count the Atoms</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                    <p>Count the number of atoms of each element on both the reactant and product sides of the equation.</p>
                    <p>For CH₄ + O₂ → CO₂ + H₂O:</p>
                    <ul className="list-disc list-inside pl-4">
                        <li>Reactants: C=1, H=4, O=2</li>
                        <li>Products: C=1, H=2, O=3</li>
                    </ul>
                    <p>The equation is not balanced because H and O atoms are unequal.</p>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="step3">
                    <AccordionTrigger className="text-lg hover:text-accent">Step 3: Adjust Coefficients</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                    <p>Add coefficients (numbers placed in front of chemical formulas) to balance the atoms. <strong>Never change the subscripts in the formulas.</strong></p>
                    <ol className="list-decimal list-inside pl-4 space-y-1">
                        <li>Balance elements that appear in only one reactant and one product first. (Here, C is already balanced).</li>
                        <li>Balance Hydrogen (H): Reactants have 4 H, Products have 2 H. Place a coefficient of 2 in front of H₂O.
                            <p className="font-mono text-sm p-2 bg-muted rounded my-1">CH₄ + O₂ → CO₂ + 2H₂O</p>
                            Now, Products: C=1, H=4, O = (1*2 from CO₂) + (2*1 from 2H₂O) = 4.
                        </li>
                        <li>Balance Oxygen (O): Reactants have 2 O, Products have 4 O. Place a coefficient of 2 in front of O₂.
                            <p className="font-mono text-sm p-2 bg-muted rounded my-1">CH₄ + 2O₂ → CO₂ + 2H₂O</p>
                        </li>
                    </ol>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="step4">
                    <AccordionTrigger className="text-lg hover:text-accent">Step 4: Verify the Balance</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                    <p>Count the atoms on both sides again to ensure they are equal.</p>
                    <p>For CH₄ + 2O₂ → CO₂ + 2H₂O:</p>
                    <ul className="list-disc list-inside pl-4">
                        <li>Reactants: C=1, H=4, O=(2*2)=4</li>
                        <li>Products: C=1, H=(2*2)=4, O=(1*2 + 2*1)=4</li>
                    </ul>
                    <p>All atoms are balanced. The equation is correctly balanced.</p>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="tips">
                    <AccordionTrigger className="text-lg hover:text-accent">Tips for Balancing</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                        <ul className="list-disc list-inside pl-4 space-y-1">
                            <li>Start with the most complex molecule or elements that appear in the fewest places.</li>
                            <li>Treat polyatomic ions (e.g., SO₄²⁻, NO₃⁻) as single units if they appear unchanged on both sides.</li>
                            <li>If you end up with fractional coefficients, multiply the entire equation by the denominator to get whole numbers.</li>
                            <li>Double-check your work!</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </CardContent>
    </Card>
  );
}
