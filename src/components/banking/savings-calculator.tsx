
// src/components/banking/savings-calculator.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PiggyBank } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/settings-context";

export function SavingsCalculator() {
  const [initialDeposit, setInitialDeposit] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("0"); // Default to 0
  const [apy, setApy] = useState("");
  const [timeHorizonYears, setTimeHorizonYears] = useState("");

  const [futureBalance, setFutureBalance] = useState<string | null>(null);
  const [totalInterestEarned, setTotalInterestEarned] = useState<string | null>(null);
  const [totalContributions, setTotalContributions] = useState<string|null>(null);

  const { toast } = useToast();
  const { formatNumber } = useSettings();

  const calculateSavingsGrowth = () => {
    const P = parseFloat(initialDeposit); // Initial principal
    const PMT = parseFloat(monthlyContribution); // Monthly payment/contribution
    const annualRate = parseFloat(apy) / 100; // Annual percentage yield (decimal)
    const t = parseInt(timeHorizonYears); // Time in years

    if (isNaN(P) || P < 0) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a valid non-negative initial deposit." });
      return;
    }
     if (isNaN(PMT) || PMT < 0) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a valid non-negative monthly contribution." });
      return;
    }
    if (isNaN(annualRate) || annualRate < 0) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a valid non-negative APY." });
      return;
    }
    if (isNaN(t) || t <= 0) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a valid positive time horizon in years." });
      return;
    }

    const r = annualRate / 12; // Monthly interest rate
    const n = t * 12; // Total number of compounding periods (months)

    // Future Value of a Series Formula (for contributions): FV = PMT * [((1 + r)^n - 1) / r]
    // Future Value of a Present Sum: FV = P * (1 + r)^n
    
    let calculatedFutureBalance = P * Math.pow(1 + r, n);
    if (r > 0) { // If there's interest, add future value of contributions
      calculatedFutureBalance += PMT * ((Math.pow(1 + r, n) - 1) / r);
    } else { // If no interest, contributions are just added linearly
      calculatedFutureBalance += PMT * n;
    }

    if (!isFinite(calculatedFutureBalance)) {
        setFutureBalance("Error in calculation. Result too large or inputs invalid.");
        setTotalInterestEarned(null);
        setTotalContributions(null);
        return;
    }
    
    const calculatedTotalContributions = P + (PMT * n);
    const calculatedTotalInterest = calculatedFutureBalance - calculatedTotalContributions;

    setFutureBalance(formatNumber(calculatedFutureBalance));
    setTotalInterestEarned(formatNumber(calculatedTotalInterest));
    setTotalContributions(formatNumber(calculatedTotalContributions));
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center">
          <PiggyBank className="mr-3 h-7 w-7" /> Savings Growth Calculator
        </CardTitle>
        <CardDescription>
          Estimate the future value of your savings with compound interest (compounded monthly).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="savings-initial">Initial Deposit ($)</Label>
            <Input id="savings-initial" type="number" value={initialDeposit} onChange={(e) => setInitialDeposit(e.target.value)} placeholder="e.g., 1000" />
          </div>
          <div>
            <Label htmlFor="savings-monthly-contrib">Monthly Contribution ($)</Label>
            <Input id="savings-monthly-contrib" type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} placeholder="e.g., 100" />
          </div>
          <div>
            <Label htmlFor="savings-apy">Annual Percentage Yield (APY %)</Label>
            <Input id="savings-apy" type="number" value={apy} onChange={(e) => setApy(e.target.value)} placeholder="e.g., 2.5" />
          </div>
          <div>
            <Label htmlFor="savings-term-years">Time Horizon (Years)</Label>
            <Input id="savings-term-years" type="number" value={timeHorizonYears} onChange={(e) => setTimeHorizonYears(e.target.value)} placeholder="e.g., 10" />
          </div>
        </div>
        <Button onClick={calculateSavingsGrowth} className="w-full sm:w-auto">Calculate Growth</Button>
        
        {(futureBalance || totalInterestEarned) && (
          <div className="mt-6 p-4 bg-muted rounded-md space-y-2">
            <h3 className="text-lg font-semibold text-primary">Results:</h3>
            {futureBalance && <p><span className="font-medium">Future Balance:</span> ${futureBalance}</p>}
            {totalContributions && <p><span className="font-medium">Total Contributions:</span> ${totalContributions}</p>}
            {totalInterestEarned && <p><span className="font-medium">Total Interest Earned:</span> ${totalInterestEarned}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
