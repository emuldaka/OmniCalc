// src/components/advanced-calculator/graphing-section.tsx
"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Scatter, ScatterChart, ResponsiveContainer, Legend } from "recharts";
import type { GraphDataPoint } from "@/app/(app)/advanced-calculator/page"; // Import shared type
import { Eraser } from "lucide-react";

interface GraphingSectionProps {
  data: GraphDataPoint[];
  onClearPlots: () => void;
}

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
};

export function GraphingSection({ data, onClearPlots }: GraphingSectionProps) {
  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Graph Plot</CardTitle>
        <CardDescription>
          Visualize your selected stored values. Plotted points will appear below.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {data.length > 0 ? (
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full h-full">
            <ScatterChart
              accessibilityLayer // Recommended for accessibility
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="category" // If 'name' is categorical like "P1", "P2"
                dataKey="name" 
                // type="number" // If 'name' can be treated as a numeric sequence for X
                // dataKey="index" // Or whatever you use for X in GraphDataPoint
                stroke="hsl(var(--muted-foreground))"
                tickLine={{ stroke: "hsl(var(--muted-foreground))" }}
              />
              <YAxis 
                dataKey="value"
                stroke="hsl(var(--muted-foreground))"
                tickLine={{ stroke: "hsl(var(--muted-foreground))" }}
                domain={['auto', 'auto']} // Auto-scale Y axis
              />
              <ChartTooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={<ChartTooltipContent hideLabel />}
              />
              <Scatter name="Stored Values" dataKey="value" fill="hsl(var(--primary))" />
            </ScatterChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No data selected for plotting. Check items in 'Stored Values' to plot.</p>
          </div>
        )}
      </CardContent>
      <div className="p-4 border-t">
        <Button onClick={onClearPlots} variant="outline" className="w-full">
          <Eraser className="mr-2 h-4 w-4" />
          Clear All Plots
        </Button>
      </div>
    </Card>
  );
}
