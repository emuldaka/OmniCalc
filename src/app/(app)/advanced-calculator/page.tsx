// src/app/(app)/advanced-calculator/page.tsx
import { AdvancedCalculatorLayout } from "@/components/advanced-calculator/advanced-calculator-layout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdvancedCalculatorPage() {
  return (
    <div className="flex flex-col h-full space-y-6 items-center">
      <Card className="w-full max-w-3xl shadow-lg"> {/* Increased max-width */}
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-primary">Advanced Scientific Calculator</CardTitle>
          <CardDescription className="text-lg">
            Perform complex calculations with scientific functions.
          </CardDescription>
        </CardHeader>
      </Card>
      <AdvancedCalculatorLayout />
    </div>
  );
}
