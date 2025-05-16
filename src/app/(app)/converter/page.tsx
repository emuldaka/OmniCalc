// src/app/(app)/converter/page.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnitConverterForm } from "@/components/converter/unit-converter-form";
import { unitCategories } from "@/lib/unit-definitions";
import type { UnitCategory } from "@/lib/unit-definitions";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSettings } from "@/contexts/settings-context";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function ConverterPage() {
  const [activeCategory1, setActiveCategory1] = useState<UnitCategory>(unitCategories[0]);
  const [activeCategory2, setActiveCategory2] = useState<UnitCategory>(unitCategories[0]); // State for the second converter
  const { formatNumber } = useSettings();
  const { toast } = useToast();

  // This function is generic and not tied to a specific converter instance for AI results from the header
  const handleAiResultForConverterPage = (result: string | number, expression: string) => {
    if (typeof result === 'number') {
       toast({
        title: "AI Calculation/Conversion",
        description: `${expression} = ${formatNumber(result)}`,
      });
    } else {
       toast({
        variant: "destructive",
        title: "AI Error",
        description: result, // This is the error message string
      });
    }
  };


  return (
    <div className="space-y-8"> {/* Increased spacing for overall page */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary">Unit Converter</CardTitle>
          <CardDescription className="text-lg">
            Select a category and convert between various units. Two independent converters are available.
            You can also use the AI input in the header for quick conversions (e.g., "10kg to pounds").
          </CardDescription>
        </CardHeader>
      </Card>
      
      {/* First Converter Instance */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-primary">Converter 1</h2>
        <Tabs
          defaultValue={activeCategory1.id}
          onValueChange={(value) => {
            const newCategory = unitCategories.find((cat) => cat.id === value);
            if (newCategory) setActiveCategory1(newCategory);
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 h-auto p-2 bg-primary/10">
            {unitCategories.map((category) => (
              <TabsTrigger
                key={`${category.id}-1`} 
                value={category.id}
                className="flex flex-col items-center justify-center gap-1 p-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-md hover:bg-accent/50 transition-colors rounded-md h-auto"
                style={{ whiteSpace: 'normal', height: 'auto', minHeight: '4rem' }}
              >
                <category.icon className="h-6 w-6 mb-1" />
                <span className="text-xs text-center">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {unitCategories.map((category) => (
            <TabsContent key={`${category.id}-1-content`} value={category.id} className="mt-6">
              <UnitConverterForm category={activeCategory1} />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Separator className="my-8" />

      {/* Second Converter Instance */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-primary">Converter 2</h2>
        <Tabs
          defaultValue={activeCategory2.id}
          onValueChange={(value) => {
            const newCategory = unitCategories.find((cat) => cat.id === value);
            if (newCategory) setActiveCategory2(newCategory);
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 h-auto p-2 bg-primary/10">
            {unitCategories.map((category) => (
              <TabsTrigger
                key={`${category.id}-2`}
                value={category.id}
                className="flex flex-col items-center justify-center gap-1 p-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-md hover:bg-accent/50 transition-colors rounded-md h-auto"
                style={{ whiteSpace: 'normal', height: 'auto', minHeight: '4rem' }}
              >
                <category.icon className="h-6 w-6 mb-1" />
                <span className="text-xs text-center">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {unitCategories.map((category) => (
            <TabsContent key={`${category.id}-2-content`} value={category.id} className="mt-6">
              <UnitConverterForm category={activeCategory2} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
