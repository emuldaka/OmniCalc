// src/components/settings/precision-settings.tsx
"use client";

import { useSettings } from "@/contexts/settings-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PrecisionSettings() {
  const { precision, setPrecision, formatNumber } = useSettings();

  const handlePrecisionChange = (value: number) => {
    setPrecision(value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      setPrecision(Math.max(0, Math.min(20, value))); // Clamp between 0 and 20
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Display Precision</CardTitle>
        <CardDescription>
          Set the number of decimal places for calculation and conversion results.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="precision-slider" className="font-medium">Decimal Places: {precision}</Label>
          <Slider
            id="precision-slider"
            min={0}
            max={10} // Slider for common range, input for up to 20
            step={1}
            value={[precision]}
            onValueChange={(newValues) => handlePrecisionChange(newValues[0])}
            aria-label={`Decimal places: ${precision}`}
          />
        </div>
        <div className="space-y-2">
           <Label htmlFor="precision-input" className="font-medium">Set Exact Precision (0-20)</Label>
           <Input
            id="precision-input"
            type="number"
            min="0"
            max="20"
            value={precision}
            onChange={handleInputChange}
            className="w-24"
            aria-label="Exact decimal places input"
           />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Example:</p>
          <p className="p-2 bg-muted rounded-md">
            10 ÷ 3 = <span className="font-semibold text-primary">{formatNumber(10 / 3)}</span>
          </p>
          <p className="p-2 bg-muted rounded-md">
            12345.6789 = <span className="font-semibold text-primary">{formatNumber(12345.6789)}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
