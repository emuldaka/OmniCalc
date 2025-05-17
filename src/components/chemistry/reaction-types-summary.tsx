
// src/components/chemistry/reaction-types-summary.tsx
"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks } from "lucide-react";

export function ReactionTypesSummary() {
  return (
    <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="text-2xl text-primary flex items-center">
                <ListChecks className="mr-3 h-7 w-7"/> Common Chemical Reaction Types
            </CardTitle>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="synthesis">
                    <AccordionTrigger className="text-lg hover:text-accent">Synthesis Reactions</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                    <p>Two or more simple substances combine to form a more complex substance.</p>
                    <p className="font-mono text-sm p-2 bg-muted rounded">General Form: A + B → AB</p>
                    <p><strong>Example:</strong> Formation of water: 2H₂ + O₂ → 2H₂O</p>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="decomposition">
                    <AccordionTrigger className="text-lg hover:text-accent">Decomposition Reactions</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                    <p>A complex substance breaks down into two or more simpler substances.</p>
                    <p className="font-mono text-sm p-2 bg-muted rounded">General Form: AB → A + B</p>
                    <p><strong>Example:</strong> Decomposition of hydrogen peroxide: 2H₂O₂ → 2H₂O + O₂</p>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="single-displacement">
                    <AccordionTrigger className="text-lg hover:text-accent">Single Displacement Reactions</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                    <p>One element replaces another element in a compound.</p>
                    <p className="font-mono text-sm p-2 bg-muted rounded">General Form: A + BC → AC + B (if A is more reactive than B)</p>
                    <p><strong>Example:</strong> Zinc reacting with hydrochloric acid: Zn + 2HCl → ZnCl₂ + H₂</p>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="double-displacement">
                    <AccordionTrigger className="text-lg hover:text-accent">Double Displacement Reactions</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                    <p>The positive and negative ions of two ionic compounds exchange places to form two new compounds.</p>
                    <p className="font-mono text-sm p-2 bg-muted rounded">General Form: AB + CD → AD + CB</p>
                    <p><strong>Example:</strong> Reaction of silver nitrate with sodium chloride: AgNO₃ + NaCl → AgCl(s) + NaNO₃</p>
                    <p>(Often results in the formation of a precipitate, gas, or water)</p>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="combustion">
                    <AccordionTrigger className="text-lg hover:text-accent">Combustion Reactions</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                    <p>A substance reacts rapidly with an oxidant, usually oxygen, to produce heat and light.</p>
                    <p>If the substance is a hydrocarbon, the products are typically carbon dioxide and water.</p>
                    <p className="font-mono text-sm p-2 bg-muted rounded">General Form (Hydrocarbon): CₓHᵧ + O₂ → CO₂ + H₂O</p>
                    <p><strong>Example:</strong> Burning of methane: CH₄ + 2O₂ → CO₂ + 2H₂O</p>
                    </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="redox">
                    <AccordionTrigger className="text-lg hover:text-accent">Redox (Oxidation-Reduction) Reactions</AccordionTrigger>
                    <AccordionContent className="text-base space-y-2">
                    <p>Reactions involving the transfer of electrons between chemical species. Oxidation is loss of electrons, reduction is gain of electrons.</p>
                    <p>Many of the above reaction types (like single displacement and combustion) are also redox reactions.</p>
                    <p><strong>Example:</strong> Rusting of iron: 4Fe + 3O₂ → 2Fe₂O₃ (Iron is oxidized, Oxygen is reduced)</p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </CardContent>
    </Card>
  );
}
