
// src/components/banking/loan-calculator.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Added Checkbox
import { HandCoins, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/settings-context";

export function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [annualInterestRate, setAnnualInterestRate] = useState("");
  const [loanTermYears, setLoanTermYears] = useState("");
  const [downPayment, setDownPayment] = useState("0");
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState("0");
  const [isBiWeekly, setIsBiWeekly] = useState(false); // New state for bi-weekly

  const [monthlyPayment, setMonthlyPayment] = useState<string | null>(null);
  const [biWeeklyPaymentDisplay, setBiWeeklyPaymentDisplay] = useState<string | null>(null); // For displaying actual bi-weekly amount
  const [totalInterest, setTotalInterest] = useState<string | null>(null);
  const [totalCost, setTotalCost] = useState<string | null>(null);
  const [payoffTime, setPayoffTime] = useState<string | null>(null);
  const [originalPayoffTime, setOriginalPayoffTime] = useState<string|null>(null);
  const [interestSaved, setInterestSaved] = useState<string|null>(null);
  const [firstPaymentInterest, setFirstPaymentInterest] = useState<string | null>(null); // New state

  const { toast } = useToast();
  const { formatNumber } = useSettings();

  const calculateLoanDetails = () => {
    const numLoanAmount = parseFloat(loanAmount);
    const numAnnualRate = parseFloat(annualInterestRate) / 100;
    const numTermYears = parseInt(loanTermYears);
    const numDownPayment = parseFloat(downPayment) || 0;
    const numExtraMonthlyPayment = parseFloat(extraMonthlyPayment) || 0;

    // Clear previous results
    setMonthlyPayment(null);
    setBiWeeklyPaymentDisplay(null);
    setTotalInterest(null);
    setTotalCost(null);
    setPayoffTime(null);
    setOriginalPayoffTime(null);
    setInterestSaved(null);
    setFirstPaymentInterest(null);


    if (isNaN(numLoanAmount) || numLoanAmount <= 0) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a valid positive loan amount." });
      return;
    }
    if (numDownPayment < 0 || numDownPayment >= numLoanAmount) {
        toast({ variant: "destructive", title: "Error", description: "Down payment must be less than loan amount and non-negative." });
        return;
    }
    const P = numLoanAmount - numDownPayment; // Principal loan amount

    if (isNaN(numAnnualRate) || numAnnualRate < 0) {
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

    let M_base: number; // Base standard monthly payment
    if (r === 0) {
        M_base = P / n_original;
    } else {
        M_base = P * (r * Math.pow(1 + r, n_original)) / (Math.pow(1 + r, n_original) - 1);
    }
    
    if (!isFinite(M_base) || M_base < 0) {
        toast({variant: "destructive", title: "Error", description: "Error calculating base monthly payment."});
        return;
    }
    setMonthlyPayment(formatNumber(M_base));

    // Calculate interest portion of the first standard monthly payment
    if (P > 0 && M_base > 0 && r > 0) {
        const interestOfFirstStdPayment = P * r;
        setFirstPaymentInterest(formatNumber(Math.max(0, interestOfFirstStdPayment)));
    } else if (P > 0 && r === 0) {
        setFirstPaymentInterest(formatNumber(0));
    }


    // Determine effective monthly payment for payoff calculation
    let M_effective_for_payoff = M_base;
    if (isBiWeekly) {
      M_effective_for_payoff = M_base * (13 / 12); // 26 half-payments = 13 full payments
      setBiWeeklyPaymentDisplay(formatNumber(M_base / 2));
    }
    const M_total_for_payoff = M_effective_for_payoff + numExtraMonthlyPayment;
    
    let n_actual_months: number;
    if (M_total_for_payoff <= 0 && P > 0) {
        toast({variant: "destructive", title: "Warning", description: "Total monthly payment is zero or less. Loan will not be paid off."});
        setPayoffTime("Loan will not be paid off.");
        return;
    }
    if (P === 0) {
      setPayoffTime("No loan amount after down payment.");
      setTotalInterest(formatNumber(0));
      setTotalCost(formatNumber(0));
      setOriginalPayoffTime("N/A");
      setInterestSaved(formatNumber(0));
      setFirstPaymentInterest(formatNumber(0));
      return;
    }

    if (r === 0) {
        n_actual_months = P / M_total_for_payoff;
    } else {
        if (M_total_for_payoff <= P * r && P > 0) {
            toast({variant: "destructive", title: "Warning", description: "Total monthly payment does not cover interest. Loan balance will increase or never be paid off.", duration: 7000});
            setPayoffTime("Balance will increase or never be paid off.");
            return;
        }
        n_actual_months = -Math.log(1 - (P * r) / M_total_for_payoff) / Math.log(1 + r);
    }

    if (!isFinite(n_actual_months) || n_actual_months < 0) {
        toast({variant: "destructive", title: "Error", description: "Cannot calculate new payoff time. Check inputs."});
        setPayoffTime("Error calculating payoff time.");
        return;
    }

    const actualYears = Math.floor(n_actual_months / 12);
    const actualRemainingMonths = Math.ceil(n_actual_months % 12);
    let actualPayoffString = "";
    if (actualYears > 0) actualPayoffString += `${actualYears} year${actualYears > 1 ? 's' : ''}`;
    if (actualRemainingMonths > 0) actualPayoffString += `${actualYears > 0 ? ', ' : ''}${actualRemainingMonths} month${actualRemainingMonths > 1 ? 's' : ''}`;
    if (actualPayoffString === "" && n_actual_months > 0 && n_actual_months < 1) actualPayoffString = "Less than a month";
    if (actualPayoffString === "" && n_actual_months === 0) actualPayoffString = "Paid off immediately";
    setPayoffTime(actualPayoffString || "N/A");

    const originalYears = Math.floor(n_original / 12);
    const originalRemainingMonths = Math.ceil(n_original % 12);
    let originalPayoffStr = "";
    if (originalYears > 0) originalPayoffStr += `${originalYears} year${originalYears > 1 ? 's' : ''}`;
    if (originalRemainingMonths > 0) originalPayoffStr += `${originalYears > 0 ? ', ' : ''}${originalRemainingMonths} month${originalRemainingMonths > 1 ? 's' : ''}`;
    setOriginalPayoffTime(originalPayoffStr || "N/A");

    const calculatedTotalCost_actual = M_total_for_payoff * n_actual_months; // Total paid with current strategy
    const calculatedTotalInterest_actual = calculatedTotalCost_actual - P;
    setTotalInterest(formatNumber(calculatedTotalInterest_actual));
    setTotalCost(formatNumber(calculatedTotalCost_actual));
    
    // Interest saved compared to standard M_base payments over n_original term
    const originalTotalCost_standard = M_base * n_original;
    const originalTotalInterest_standard = originalTotalCost_standard - P;
    
    if(numExtraMonthlyPayment > 0 || isBiWeekly){
      setInterestSaved(formatNumber(Math.max(0, originalTotalInterest_standard - calculatedTotalInterest_actual)));
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
          Calculate monthly payments, total interest, and payoff time for fixed-rate loans.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
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
          <div>
            <Label htmlFor="loan-extra-payment">Extra Monthly Payment ($)</Label>
            <Input id="loan-extra-payment" type="number" value={extraMonthlyPayment} onChange={(e) => setExtraMonthlyPayment(e.target.value)} placeholder="e.g., 100 (optional)" />
          </div>
          <div className="flex items-center space-x-2 pt-7"> {/* Aligns checkbox with other inputs */}
            <Checkbox
              id="biweekly-payments"
              checked={isBiWeekly}
              onCheckedChange={(checked) => setIsBiWeekly(checked as boolean)}
            />
            <Label htmlFor="biweekly-payments" className="font-normal">
              Make Bi-Weekly Payments
            </Label>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button onClick={calculateLoanDetails} className="w-full sm:w-auto">Calculate Loan</Button>
          {firstPaymentInterest && (
            <div className="text-sm text-muted-foreground p-2 border border-dashed rounded-md">
               <Info className="inline h-4 w-4 mr-1 mb-0.5" />
               Interest portion of 1st standard monthly payment: <span className="font-semibold text-primary">${firstPaymentInterest}</span>
            </div>
          )}
        </div>
        
        {(monthlyPayment || totalInterest) && (
          <div className="mt-6 p-4 bg-muted rounded-md space-y-2">
            <h3 className="text-lg font-semibold text-primary">Results:</h3>
            {monthlyPayment && <p><span className="font-medium">Standard Monthly Payment:</span> ${monthlyPayment}</p>}
            {isBiWeekly && biWeeklyPaymentDisplay && <p><span className="font-medium">Actual Bi-Weekly Payment:</span> ${biWeeklyPaymentDisplay} (paid every 2 weeks)</p>}
            {payoffTime && <p><span className="font-medium">Payoff Time {isBiWeekly || parseFloat(extraMonthlyPayment) > 0 ? "(with accel. payments)" : ""}:</span> {payoffTime}</p>}
            {(isBiWeekly || parseFloat(extraMonthlyPayment) > 0) && originalPayoffTime && <p className="text-sm text-muted-foreground"><span className="font-medium">Original Payoff Time (standard payments):</span> {originalPayoffTime}</p>}
            {totalInterest && <p><span className="font-medium">Total Interest Paid:</span> ${totalInterest}</p>}
            {(isBiWeekly || parseFloat(extraMonthlyPayment) > 0) && interestSaved && parseFloat(interestSaved.replace(/,/g, '')) > 0 && <p className="text-green-600 font-semibold"><span className="font-medium">Interest Saved (due to accel. payments):</span> ${interestSaved}</p>}
            {totalCost && <p><span className="font-medium">Total Loan Cost (Principal + Interest):</span> ${totalCost}</p>}
            {isBiWeekly && <p className="text-xs text-muted-foreground mt-2">Note: Bi-weekly payments effectively result in one extra standard monthly payment per year, accelerating payoff.</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
