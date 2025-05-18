
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
  const [downPayment, setDownPayment] = useState("0");
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState("0");

  const [monthlyPayment, setMonthlyPayment] = useState<string | null>(null);
  const [totalInterest, setTotalInterest] = useState<string | null>(null);
  const [totalCost, setTotalCost] = useState<string | null>(null);
  const [payoffTime, setPayoffTime] = useState<string | null>(null);
  const [originalPayoffTime, setOriginalPayoffTime] = useState<string|null>(null);
  const [interestSaved, setInterestSaved] = useState<string|null>(null);


  const { toast } = useToast();
  const { formatNumber } = useSettings();

  const calculateLoanDetails = () => {
    const numLoanAmount = parseFloat(loanAmount);
    const numAnnualRate = parseFloat(annualInterestRate) / 100;
    const numTermYears = parseInt(loanTermYears);
    const numDownPayment = parseFloat(downPayment) || 0;
    const numExtraMonthlyPayment = parseFloat(extraMonthlyPayment) || 0;

    if (isNaN(numLoanAmount) || numLoanAmount <= 0) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a valid positive loan amount." });
      return;
    }
    if (numDownPayment < 0 || numDownPayment >= numLoanAmount) {
        toast({ variant: "destructive", title: "Error", description: "Down payment must be less than loan amount and non-negative." });
        return;
    }
    const P = numLoanAmount - numDownPayment; // Principal loan amount

    if (isNaN(numAnnualRate) || numAnnualRate < 0) { // Allow 0% APR
      toast({ variant: "destructive", title: "Error", description: "Please enter a valid non-negative annual interest rate." });
      return;
    }
    if (isNaN(numTermYears) || numTermYears <= 0) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a valid positive loan term in years." });
      return;
    }
    if (isNaN(numExtraMonthlyPayment) || numExtraMonthlyPayment < 0) {
      toast({ variant: "destructive", title: "Error", description: "Extra monthly payment must be non-negative." });
      return;
    }


    const r = numAnnualRate / 12; // Monthly interest rate
    const n_original = numTermYears * 12; // Original total number of payments

    let M_base: number; // Base monthly payment
    if (r === 0) { // 0% interest
        M_base = P / n_original;
    } else {
        M_base = P * (r * Math.pow(1 + r, n_original)) / (Math.pow(1 + r, n_original) - 1);
    }
    
    if (!isFinite(M_base) || M_base < 0) {
        setMonthlyPayment("Error in base payment calc.");
        setTotalInterest(null); setTotalCost(null); setPayoffTime(null); setOriginalPayoffTime(null); setInterestSaved(null);
        return;
    }
    setMonthlyPayment(formatNumber(M_base));

    const M_total = M_base + numExtraMonthlyPayment;
    
    let n_actual_months: number; // Actual number of months to pay off with extra payments
    if (M_total <= 0 && P > 0) {
        toast({variant: "destructive", title: "Warning", description: "Total monthly payment is zero or less. Loan will not be paid off."});
        setPayoffTime("Loan will not be paid off.");
        setTotalInterest(null); setTotalCost(null); setOriginalPayoffTime(null); setInterestSaved(null);
        return;
    }
    if (P === 0) {
      setPayoffTime("No loan amount after down payment.");
      setTotalInterest(formatNumber(0));
      setTotalCost(formatNumber(0));
      setOriginalPayoffTime("N/A");
      setInterestSaved(formatNumber(0));
      return;
    }


    if (r === 0) {
        n_actual_months = P / M_total;
    } else {
        // Check if total payment covers interest
        if (M_total <= P * r && P > 0) {
            toast({variant: "destructive", title: "Warning", description: "Total monthly payment does not cover interest. Loan balance will increase.", duration: 7000});
            setPayoffTime("Balance will increase or never be paid off.");
            setTotalInterest(null); setTotalCost(null); setOriginalPayoffTime(null); setInterestSaved(null);
            return;
        }
        n_actual_months = -Math.log(1 - (P * r) / M_total) / Math.log(1 + r);
    }

    if (!isFinite(n_actual_months) || n_actual_months < 0) {
        setPayoffTime("Error calculating new payoff time.");
        setTotalInterest(null); setTotalCost(null); setOriginalPayoffTime(null); setInterestSaved(null);
        return;
    }

    const actualYears = Math.floor(n_actual_months / 12);
    const actualRemainingMonths = Math.ceil(n_actual_months % 12);
    let actualPayoffString = "";
    if (actualYears > 0) actualPayoffString += `${actualYears} year${actualYears > 1 ? 's' : ''}`;
    if (actualRemainingMonths > 0) actualPayoffString += `${actualYears > 0 ? ', ' : ''}${actualRemainingMonths} month${actualRemainingMonths > 1 ? 's' : ''}`;
    if (actualPayoffString === "" && n_actual_months > 0) actualPayoffString = "Less than a month";
    if (n_actual_months === 0) actualPayoffString = "Paid off immediately";
    setPayoffTime(actualPayoffString || "N/A");

    const originalYears = Math.floor(n_original / 12);
    const originalRemainingMonths = Math.ceil(n_original % 12);
    let originalPayoffStr = "";
    if (originalYears > 0) originalPayoffStr += `${originalYears} year${originalYears > 1 ? 's' : ''}`;
    if (originalRemainingMonths > 0) originalPayoffStr += `${originalYears > 0 ? ', ' : ''}${originalRemainingMonths} month${originalRemainingMonths > 1 ? 's' : ''}`;
    setOriginalPayoffTime(originalPayoffStr || "N/A");

    const calculatedTotalCost_actual = M_total * n_actual_months;
    const calculatedTotalInterest_actual = calculatedTotalCost_actual - P;
    setTotalInterest(formatNumber(calculatedTotalInterest_actual));
    setTotalCost(formatNumber(calculatedTotalCost_actual));
    
    const originalTotalCost = M_base * n_original;
    const originalTotalInterest = originalTotalCost - P;
    if(numExtraMonthlyPayment > 0){
      setInterestSaved(formatNumber(originalTotalInterest - calculatedTotalInterest_actual));
    } else {
      setInterestSaved(null);
    }

  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center">
          <HandCoins className="mr-3 h-7 w-7" /> Loan Calculator
        </CardTitle>
        <CardDescription>
          Calculate monthly payments, total interest, and payoff time for fixed-rate loans, including effects of down payments and extra payments.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <Label htmlFor="loan-amount">Loan Amount ($)</Label>
            <Input id="loan-amount" type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder="e.g., 250000" />
          </div>
          <div>
            <Label htmlFor="loan-downpayment">Down Payment ($)</Label>
            <Input id="loan-downpayment" type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} placeholder="e.g., 50000" />
          </div>
          <div>
            <Label htmlFor="loan-apr">Annual Interest Rate (APR %)</Label>
            <Input id="loan-apr" type="number" value={annualInterestRate} onChange={(e) => setAnnualInterestRate(e.target.value)} placeholder="e.g., 5.5" />
          </div>
          <div>
            <Label htmlFor="loan-term">Loan Term (Years)</Label>
            <Input id="loan-term" type="number" value={loanTermYears} onChange={(e) => setLoanTermYears(e.target.value)} placeholder="e.g., 30" />
          </div>
          <div className="md:col-span-2"> {/* Allow extra payment to span more if needed, or adjust layout */}
            <Label htmlFor="loan-extra-payment">Extra Monthly Payment ($) (Optional)</Label>
            <Input id="loan-extra-payment" type="number" value={extraMonthlyPayment} onChange={(e) => setExtraMonthlyPayment(e.target.value)} placeholder="e.g., 100" />
          </div>
        </div>
        <Button onClick={calculateLoanDetails} className="w-full sm:w-auto">Calculate Loan</Button>
        
        {(monthlyPayment || totalInterest) && (
          <div className="mt-6 p-4 bg-muted rounded-md space-y-2">
            <h3 className="text-lg font-semibold text-primary">Results:</h3>
            {monthlyPayment && <p><span className="font-medium">Base Monthly Payment:</span> ${monthlyPayment}</p>}
            {payoffTime && <p><span className="font-medium">Payoff Time (with extra payments):</span> {payoffTime}</p>}
            {extraMonthlyPayment !== "0" && parseFloat(extraMonthlyPayment) > 0 && originalPayoffTime && <p className="text-sm text-muted-foreground"><span className="font-medium">Original Payoff Time (no extra):</span> {originalPayoffTime}</p>}
            {totalInterest && <p><span className="font-medium">Total Interest Paid:</span> ${totalInterest}</p>}
             {extraMonthlyPayment !== "0" && parseFloat(extraMonthlyPayment) > 0 && interestSaved && <p className="text-green-600 font-semibold"><span className="font-medium">Interest Saved with Extra Payments:</span> ${interestSaved}</p>}
            {totalCost && <p><span className="font-medium">Total Loan Cost:</span> ${totalCost}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

    