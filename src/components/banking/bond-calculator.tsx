
// src/components/banking/bond-calculator.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react"; // Placeholder icon
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/settings-context";

export function BondCalculator() {
  const [faceValue, setFaceValue] = useState("");
  const [couponRate, setCouponRate] = useState("");
  const [marketPrice, setMarketPrice] = useState("");

  const [currentYield, setCurrentYield] = useState<string | null>(null);

  const { toast } = useToast();
  const { formatNumber } = useSettings();

  const calculateBondDetails = () => {
    const numFaceValue = parseFloat(faceValue);
    const numCouponRate = parseFloat(couponRate) / 100; // Convert percentage to decimal
    const numMarketPrice = parseFloat(marketPrice);

    if (isNaN(numFaceValue) || numFaceValue <= 0) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a valid positive face value." });
      return;
    }
    if (isNaN(numCouponRate) || numCouponRate < 0) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a valid non-negative coupon rate." });
      return;
    }
    if (isNaN(numMarketPrice) || numMarketPrice <= 0) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a valid positive market price." });
      return;
    }

    const annualCouponPayment = numFaceValue * numCouponRate;
    const calculatedCurrentYield = (annualCouponPayment / numMarketPrice) * 100; // As percentage

    if (!isFinite(calculatedCurrentYield)) {
        setCurrentYield("Error in calculation. Check inputs.");
        return;
    }

    setCurrentYield(formatNumber(calculatedCurrentYield));
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center">
          <FileText className="mr-3 h-7 w-7" /> Bond Calculator
        </CardTitle>
        <CardDescription>
          Calculate basic bond metrics like current yield.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="bond-face-value">Face Value (Par Value) ($)</Label>
            <Input id="bond-face-value" type="number" value={faceValue} onChange={(e) => setFaceValue(e.target.value)} placeholder="e.g., 1000" />
          </div>
          <div>
            <Label htmlFor="bond-coupon-rate">Annual Coupon Rate (%)</Label>
            <Input id="bond-coupon-rate" type="number" value={couponRate} onChange={(e) => setCouponRate(e.target.value)} placeholder="e.g., 5" />
          </div>
          <div>
            <Label htmlFor="bond-market-price">Current Market Price ($)</Label>
            <Input id="bond-market-price" type="number" value={marketPrice} onChange={(e) => setMarketPrice(e.target.value)} placeholder="e.g., 980" />
          </div>
        </div>
        <Button onClick={calculateBondDetails} className="w-full sm:w-auto">Calculate Bond Metrics</Button>
        
        {currentYield && (
          <div className="mt-6 p-4 bg-muted rounded-md space-y-2">
            <h3 className="text-lg font-semibold text-primary">Results:</h3>
            {currentYield && <p><span className="font-medium">Current Yield:</span> {currentYield}%</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
