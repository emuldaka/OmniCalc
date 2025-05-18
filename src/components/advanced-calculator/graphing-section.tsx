
// src/components/advanced-calculator/graphing-section.tsx
"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Line, ResponsiveContainer, Legend } from "recharts";
import type { FunctionPlotData } from "@/app/(app)/graphing/page"; // Updated path
import { Eraser } from "lucide-react";

interface GraphingSectionProps {
  data: FunctionPlotData[];
  onClearPlots: () => void; // Simplified: parent will know which graph via closure
  graphTitle: string;
}

export function GraphingSection({ data, onClearPlots, graphTitle }: GraphingSectionProps) {
  return (
    <Card className="shadow-lg h-full flex flex-col min-h-[400px]">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">{graphTitle}</CardTitle>
        <CardDescription>
          Visualize your selected equations. Plotted functions will appear below.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {data.length > 0 ? (
          <ChartContainer config={{}} className="min-h-[300px] w-full h-full">
            <LineChart
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number"
                dataKey="x"
                stroke="hsl(var(--muted-foreground))"
                tickLine={{ stroke: "hsl(var(--muted-foreground))" }}
                domain={['auto', 'auto']}
                label={{ value: "x", position: "insideBottomRight", offset: -10, fill: "hsl(var(--foreground))" }}
              />
              <YAxis
                dataKey="y"
                stroke="hsl(var(--muted-foreground))"
                tickLine={{ stroke: "hsl(var(--muted-foreground))" }}
                domain={['auto', 'auto']}
                label={{ value: "y = f(x)", angle: -90, position: "insideLeft", fill: "hsl(var(--foreground))" }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background/80 backdrop-blur-sm p-2 border border-border rounded-md shadow-lg">
                        <p className="label text-sm font-bold">{`x: ${payload[0].payload.x.toFixed(2)}`}</p>
                        {payload.map((entry) => (
                           <p key={entry.name} style={{ color: entry.stroke }} className="text-xs">
                             {`${entry.name}: ${entry.payload.y.toFixed(2)}`}
                           </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              {data.map((funcData) => (
                <Line
                  key={funcData.id}
                  type="monotone"
                  dataKey="y"
                  data={funcData.points}
                  stroke={funcData.color}
                  name={funcData.name}
                  dot={false}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No equations selected for plotting on this graph.</p>
          </div>
        )}
      </CardContent>
      <div className="p-4 border-t">
        <Button onClick={onClearPlots} variant="outline" className="w-full">
          <Eraser className="mr-2 h-4 w-4" />
          Clear Plotted Equations on This Graph
        </Button>
      </div>
    </Card>
  );
}
