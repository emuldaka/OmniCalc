
// src/app/(app)/banking/page.tsx
"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Landmark } from "lucide-react";
import { CreditCardCalculator } from "@/components/banking/credit-card-calculator";
import { LoanCalculator } from "@/components/banking/loan-calculator";
import { BondCalculator } from "@/components/banking/bond-calculator";
import { SavingsCalculator } from "@/components/banking/savings-calculator";
import { Separator } from "@/components/ui/separator";

export default function BankingPage() {
  return (
    <div className="space-y-8 w-full">
      <Card className="shadow-2xl w-full">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-primary flex items-center">
            <Landmark className="mr-4 h-10 w-10" /> Banking & Financial Calculators
          </CardTitle>
          <CardDescription className="text-xl text-muted-foreground">
            Tools for managing credit cards, loans, investments, and savings.
          </CardDescription>
        </CardHeader>
      </Card>

      <CreditCardCalculator />
      <Separator className="my-8" />
      <LoanCalculator />
      <Separator className="my-8" />
      <BondCalculator />
      <Separator className="my-8" />
      <SavingsCalculator />
      
    </div>
  );
}
