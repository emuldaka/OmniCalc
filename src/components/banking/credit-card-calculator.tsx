
// src/components/banking/credit-card-calculator.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/settings-context";

export function CreditCardCalculator() {
  const [balance, setBalance] = useState("");
  const [apr, setApr] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");

  const [timeToPayOff, setTimeToPayOff] = useState<string | null>(null);
  const [totalInterest, setTotalInterest] = useState<string | null>(null);
  const [totalPayments, setTotalPayments] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { formatNumber } = useSettings();

  const calculateCreditCardPayoff = () => {
    const numBalance = parseFloat(balance);
    const numApr = parseFloat(apr) / 100; // Convert APR from percentage to decimal
    const numMonthlyPayment = parseFloat(monthlyPayment);

    if (isNaN(numBalance) || numBalance <= 0) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a valid positive balance." });
      return;
    }
    if (isNaN(numApr) || numApr < 0) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a valid non-negative APR." });
      return;
    }
    if (isNaN(numMonthlyPayment) || numMonthlyPayment <= 0) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a valid positive monthly payment." });
      return;
    }

    const monthlyInterestRate = numApr / 12;

    if (numMonthlyPayment <= numBalance * monthlyInterestRate) {
      setTimeToPayOff("Your monthly payment is too low to cover the interest. You will never pay off the balance.");
      setTotalInterest(null);
      setTotalPayments(null);
      toast({ variant: "destructive", title: "Warning", description: "Monthly payment is less than or equal to the interest accrued. Balance will not decrease.", duration: 7000 });
      return;
    }

    // Using the NPER formula: N = -ln(1 - (I * P) / A) / ln(1 + I)
    // N = number of payments, I = monthly interest rate, P = principal/balance, A = monthly payment
    let months = 0;
    try {
      const numerator = Math.log(1 - (monthlyInterestRate * numBalance) / numMonthlyPayment);
      const denominator = Math.log(1 + monthlyInterestRate);
      if (denominator === 0) throw new Error("Cannot divide by zero in payoff calculation (interest rate issue).");
       months = -numerator / denominator;
    } catch (e) {
       setTimeToPayOff("Error in calculation (likely due to payment vs interest issue).");
       return;
    }
    

    if (months <= 0 || !isFinite(months)) {
      setTimeToPayOff("Cannot calculate payoff time with these inputs. Payment might be too low.");
      setTotalInterest(null);
      setTotalPayments(null);
      return;
    }
    
    const years = Math.floor(months / 12);
    const remainingMonths = Math.ceil(months % 12);
    let payoffString = "";
    if (years > 0) payoffString += `${years} year${years > 1 ? 's' : ''}`;
    if (remainingMonths > 0) payoffString += `${years > 0 ? ', ' : ''}${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    if (payoffString === "") payoffString = "Less than a month";


    const calculatedTotalPayments = numMonthlyPayment * months;
    const calculatedTotalInterest = calculatedTotalPayments - numBalance;

    setTimeToPayOff(payoffString);
    setTotalInterest(formatNumber(calculatedTotalInterest));
    setTotalPayments(formatNumber(calculatedTotalPayments));
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center">
          <CreditCard className="mr-3 h-7 w-7" /> Credit Card Payoff Calculator
        </CardTitle>
        <CardDescription>
          Estimate how long it will take to pay off your credit card balance and the total interest paid. Assumes monthly compounding.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="cc-balance">Current Balance ($)</Label>
            <Input id="cc-balance" type="number" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="e.g., 5000" />
          </div>
          <div>
            <Label htmlFor="cc-apr">Annual Percentage Rate (APR %)</Label>
            <Input id="cc-apr" type="number" value={apr} onChange={(e) => setApr(e.target.value)} placeholder="e.g., 18.9" />
          </div>
          <div>
            <Label htmlFor="cc-monthly-payment">Monthly Payment ($)</Label>
            <Input id="cc-monthly-payment" type="number" value={monthlyPayment} onChange={(e) => setMonthlyPayment(e.target.value)} placeholder="e.g., 200" />
          </div>
        </div>
        <Button onClick={calculateCreditCardPayoff} className="w-full sm:w-auto">Calculate Payoff</Button>
        
        {(timeToPayOff || totalInterest) && (
          <div className="mt-6 p-4 bg-muted rounded-md space-y-2">
            <h3 className="text-lg font-semibold text-primary">Results:</h3>
            {timeToPayOff && <p><span className="font-medium">Time to Pay Off:</span> {timeToPayOff}</p>}
            {totalInterest && <p><span className="font-medium">Total Interest Paid:</span> ${totalInterest}</p>}
            {totalPayments && <p><span className="font-medium">Total Payments Made:</span> ${totalPayments}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
