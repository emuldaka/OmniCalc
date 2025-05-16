// src/app/(app)/converter/page.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnitConverterForm } from "@/components/converter/unit-converter-form";
import { unitCategories } from "@/lib/unit-definitions";
import type { UnitCategory } from "@/lib/unit-definitions";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// AI Input Field is now in the header via (app)/layout.tsx and ServerAiHandler
// import { AiInputField } from "@/components/shared/ai-input-field";
import { useSettings } from "@/contexts/settings-context";
import { useToast } from "@/hooks/use-toast";


export default function ConverterPage() {
  const [activeCategory, setActiveCategory] = useState<UnitCategory>(unitCategories[0]);
  const { formatNumber } = useSettings();
  const { toast } = useToast();

  // This function would be called by ServerAiHandler to update converter state
  const handleAiResultForConverter = (result: string | number, expression: string) => {
    // For now, AI results are general. Specific parsing for converter units/values from AI
    // would require more complex AI response structure or client-side parsing.
    // We can display the AI result as a general piece of information.
    if (typeof result === 'number') {
       toast({
        title: "AI Calculation/Conversion",
        description: `${expression} = ${formatNumber(result)}`,
      });
      // Optionally, if the current form's onAiResult prop was connected, it could try to use it.
      // e.g. pass this handler to UnitConverterForm.
    } else {
       toast({
        variant: "destructive",
        title: "AI Error",
        description: result, // This is the error message string
      });
    }
  };


  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary">Unit Converter</CardTitle>
          <CardDescription className="text-lg">
            Select a category and convert between various units.
            You can also use the AI input in the header for quick conversions (e.g., "10kg to pounds").
          </CardDescription>
        </CardHeader>
      </Card>
      
      {/* AI Input Field is now in the header via (app)/layout.tsx and ServerAiHandler */}
      {/* <div className="my-4">
         <AiInputField onAiResult={handleAiResultForConverter} placeholder="AI: 100 USD to EUR or 5 miles to km"/>
      </div> */}

      <Tabs
        defaultValue={activeCategory.id}
        onValueChange={(value) => {
          const newCategory = unitCategories.find((cat) => cat.id === value);
          if (newCategory) setActiveCategory(newCategory);
        }}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 h-auto p-2 bg-primary/10">
          {unitCategories.map((category) => (
            <TabsTrigger
              key={category.id}
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
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <UnitConverterForm category={category} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
