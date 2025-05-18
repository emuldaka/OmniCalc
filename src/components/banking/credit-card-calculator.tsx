
// src/components/banking/credit-card-calculator.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/settings-context";

type PaymentType = "fixed" | "percentage";

export function CreditCardCalculator() {
  const [balance, setBalance] = useState("");
  const [apr, setApr] = useState("");
  const [paymentType, setPaymentType] = useState<PaymentType>("fixed");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [paymentPercentage, setPaymentPercentage] = useState("2"); // Default 2%

  const [timeToPayOff, setTimeToPayOff] = useState<string | null>(null);
  const [totalInterest, setTotalInterest] = useState<string | null>(null);
  const [totalPayments, setTotalPayments] = useState<string | null>(null);
  const [actualMonthlyPaymentUsed, setActualMonthlyPaymentUsed] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { formatNumber } = useSettings();

  const calculateCreditCardPayoff = () => {
    const numBalance = parseFloat(balance);
    const numApr = parseFloat(apr) / 100; // Convert APR from percentage to decimal
    
    let numEffectiveMonthlyPayment: number;

    if (paymentType === "fixed") {
      numEffectiveMonthlyPayment = parseFloat(monthlyPayment);
      if (isNaN(numEffectiveMonthlyPayment) || numEffectiveMonthlyPayment <= 0) {
        toast({ variant: "destructive", title: "Error", description: "Please enter a valid positive fixed monthly payment." });
        return;
      }
    } else { // paymentType === "percentage"
      const perc = parseFloat(paymentPercentage) / 100;
      if (isNaN(perc) || perc <= 0 || perc > 100) {
        toast({ variant: "destructive", title: "Error", description: "Please enter a valid payment percentage (e.g., 1-100)." });
        return;
      }
      numEffectiveMonthlyPayment = numBalance * perc;
      if (numEffectiveMonthlyPayment <= 0) {
         toast({ variant: "destructive", title: "Error", description: "Calculated percentage payment is zero or less. Increase percentage or balance." });
        return;
      }
    }
    setActualMonthlyPaymentUsed(formatNumber(numEffectiveMonthlyPayment));


    if (isNaN(numBalance) || numBalance <= 0) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a valid positive balance." });
      return;
    }
    if (isNaN(numApr) || numApr < 0) { // Allow 0% APR
      toast({ variant: "destructive", title: "Error", description: "Please enter a valid non-negative APR." });
      return;
    }

    const monthlyInterestRate = numApr / 12;

    if (monthlyInterestRate > 0 && numEffectiveMonthlyPayment <= numBalance * monthlyInterestRate) {
      setTimeToPayOff("Your monthly payment is too low to cover the interest. You will likely never pay off the balance.");
      setTotalInterest(null);
      setTotalPayments(null);
      toast({ variant: "destructive", title: "Warning", description: "Monthly payment is less than or equal to the interest accrued. Balance will not decrease.", duration: 7000 });
      return;
    }
    
    if (numEffectiveMonthlyPayment === 0 && numBalance > 0) {
        setTimeToPayOff("With zero payment, the balance will not be paid off.");
        setTotalInterest(null);
        setTotalPayments(null);
        return;
    }
    if (numBalance === 0) {
        setTimeToPayOff("Balance is already zero.");
        setTotalInterest(formatNumber(0));
        setTotalPayments(formatNumber(0));
        return;
    }


    let months = 0;
    if (monthlyInterestRate === 0) { // 0% APR
        months = numBalance / numEffectiveMonthlyPayment;
    } else {
        try {
            // NPER formula: N = -ln(1 - (I * P) / A) / ln(1 + I)
            const numerator = Math.log(1 - (monthlyInterestRate * numBalance) / numEffectiveMonthlyPayment);
            const denominator = Math.log(1 + monthlyInterestRate);
            if (denominator === 0) throw new Error("Cannot divide by zero in payoff calculation (interest rate issue).");
            months = -numerator / denominator;
        } catch (e) {
            setTimeToPayOff("Error in calculation (likely due to payment vs interest issue or very high APR).");
            return;
        }
    }
    

    if (months <= 0 || !isFinite(months)) {
      setTimeToPayOff("Cannot calculate payoff time. Payment might be too low or inputs invalid.");
      setTotalInterest(null);
      setTotalPayments(null);
      return;
    }
    
    const years = Math.floor(months / 12);
    const remainingMonths = Math.ceil(months % 12);
    let payoffString = "";
    if (years > 0) payoffString += `${years} year${years > 1 ? 's' : ''}`;
    if (remainingMonths > 0) payoffString += `${years > 0 ? ', ' : ''}${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    if (payoffString === "" && months > 0) payoffString = "Less than a month";
    if (months === 0) payoffString = "Paid off immediately";


    const calculatedTotalPayments = numEffectiveMonthlyPayment * months;
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
          Estimate how long it will take to pay off your credit card balance. Assumes monthly compounding.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <Label htmlFor="cc-balance">Current Balance ($)</Label>
            <Input id="cc-balance" type="number" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="e.g., 5000" />
          </div>
          <div>
            <Label htmlFor="cc-apr">Annual Percentage Rate (APR %)</Label>
            <Input id="cc-apr" type="number" value={apr} onChange={(e) => setApr(e.target.value)} placeholder="e.g., 18.9" />
          </div>
          <div>
            <Label htmlFor="cc-payment-type">Payment Type</Label>
            <Select value={paymentType} onValueChange={(value) => setPaymentType(value as PaymentType)}>
              <SelectTrigger id="cc-payment-type">
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
                <SelectItem value="percentage">Percentage of Balance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {paymentType === "fixed" ? (
            <div>
              <Label htmlFor="cc-monthly-payment">Monthly Payment ($)</Label>
              <Input id="cc-monthly-payment" type="number" value={monthlyPayment} onChange={(e) => setMonthlyPayment(e.target.value)} placeholder="e.g., 200" />
            </div>
          ) : (
            <div>
              <Label htmlFor="cc-payment-percentage">Payment Percentage (%)</Label>
              <Input id="cc-payment-percentage" type="number" value={paymentPercentage} onChange={(e) => setPaymentPercentage(e.target.value)} placeholder="e.g., 2" />
            </div>
          )}
        </div>
        <Button onClick={calculateCreditCardPayoff} className="w-full sm:w-auto">Calculate Payoff</Button>
        
        {(timeToPayOff || totalInterest) && (
          <div className="mt-6 p-4 bg-muted rounded-md space-y-2">
            <h3 className="text-lg font-semibold text-primary">Results:</h3>
            {actualMonthlyPaymentUsed && paymentType === 'percentage' && <p><span className="font-medium">Calculated Monthly Payment:</span> ${actualMonthlyPaymentUsed} (based on {paymentPercentage}% of initial balance)</p>}
            {timeToPayOff && <p><span className="font-medium">Time to Pay Off:</span> {timeToPayOff}</p>}
            {totalInterest && <p><span className="font-medium">Total Interest Paid:</span> ${totalInterest}</p>}
            {totalPayments && <p><span className="font-medium">Total Payments Made:</span> ${totalPayments}</p>}
            {paymentType === 'percentage' && <p className="text-xs text-muted-foreground">Note: For "Percentage of Balance", the calculation assumes the initial percentage payment is made consistently each month.</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

    