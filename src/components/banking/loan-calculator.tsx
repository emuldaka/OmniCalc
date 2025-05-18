
// src/components/banking/loan-calculator.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HandCoins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/settings-context";

export function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [annualInterestRate, setAnnualInterestRate] = useState("");
  const [loanTermYears, setLoanTermYears] = useState("");

  const [monthlyPayment, setMonthlyPayment] = useState<string | null>(null);
  const [totalInterest, setTotalInterest] = useState<string | null>(null);
  const [totalCost, setTotalCost] = useState<string | null>(null);

  const { toast } = useToast();
  const { formatNumber } = useSettings();

  const calculateLoanDetails = () => {
    const P = parseFloat(loanAmount); // Principal loan amount
    const annualRate = parseFloat(annualInterestRate) / 100; // Annual interest rate (decimal)
    const termYears = parseInt(loanTermYears);

    if (isNaN(P) || P <= 0) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a valid positive loan amount." });
      return;
    }
    if (isNaN(annualRate) || annualRate < 0) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a valid non-negative annual interest rate." });
      return;
    }
    if (isNaN(termYears) || termYears <= 0) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a valid positive loan term in years." });
      return;
    }

    const r = annualRate / 12; // Monthly interest rate
    const n = termYears * 12; // Total number of payments (months)

    if (r === 0) { // Simple case for 0% interest
        const M = P / n;
        setMonthlyPayment(formatNumber(M));
        setTotalInterest(formatNumber(0));
        setTotalCost(formatNumber(P));
        return;
    }
    
    // Monthly Payment Formula: M = P [ r(1 + r)^n ] / [ (1 + r)^n – 1]
    const M = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    if (!isFinite(M) || M <= 0) {
        setMonthlyPayment("Error in calculation. Check inputs.");
        setTotalInterest(null);
        setTotalCost(null);
        return;
    }

    const calculatedTotalCost = M * n;
    const calculatedTotalInterest = calculatedTotalCost - P;

    setMonthlyPayment(formatNumber(M));
    setTotalInterest(formatNumber(calculatedTotalInterest));
    setTotalCost(formatNumber(calculatedTotalCost));
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center">
          <HandCoins className="mr-3 h-7 w-7" /> Loan Calculator
        </CardTitle>
        <CardDescription>
          Calculate monthly payments and total interest for fixed-rate loans.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="loan-amount">Loan Amount ($)</Label>
            <Input id="loan-amount" type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder="e.g., 250000" />
          </div>
          <div>
            <Label htmlFor="loan-apr">Annual Interest Rate (APR %)</Label>
            <Input id="loan-apr" type="number" value={annualInterestRate} onChange={(e) => setAnnualInterestRate(e.target.value)} placeholder="e.g., 5.5" />
          </div>
          <div>
            <Label htmlFor="loan-term">Loan Term (Years)</Label>
            <Input id="loan-term" type="number" value={loanTermYears} onChange={(e) => setLoanTermYears(e.target.value)} placeholder="e.g., 30" />
          </div>
        </div>
        <Button onClick={calculateLoanDetails} className="w-full sm:w-auto">Calculate Loan</Button>
        
        {(monthlyPayment || totalInterest) && (
          <div className="mt-6 p-4 bg-muted rounded-md space-y-2">
            <h3 className="text-lg font-semibold text-primary">Results:</h3>
            {monthlyPayment && <p><span className="font-medium">Monthly Payment:</span> ${monthlyPayment}</p>}
            {totalInterest && <p><span className="font-medium">Total Interest Paid:</span> ${totalInterest}</p>}
            {totalCost && <p><span className="font-medium">Total Loan Cost:</span> ${totalCost}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
