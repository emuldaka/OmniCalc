
// src/components/advanced-calculator/stored-equations-container.tsx
"use client";

import type { EquationItem } from "@/app/(app)/graphing/page"; // Updated path
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, LineChart } from "lucide-react";

interface StoredEquationsContainerProps {
  equations: EquationItem[];
  onTogglePlot: (id: string, graphNumber: 1 | 2 | 3) => void;
  onDeleteEquation: (id: string) => void;
}

export function StoredEquationsContainer({
  equations,
  onTogglePlot,
  onDeleteEquation,
}: StoredEquationsContainerProps) {
  if (equations.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No equations stored yet.</p>
        <p>Use the f(x) Equation Definer to add equations.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[250px] w-full rounded-md border p-4 shadow-inner bg-muted/30">
      <div className="space-y-3">
        {equations.map((item) => (
          <Card key={item.id} className="p-3 shadow-sm bg-background hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label
                  className="font-mono text-sm cursor-pointer hover:text-primary block truncate"
                  title={item.equationString}
                >
                  y = {item.equationString}
                </label>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <LineChart className="h-3 w-3 mr-1.5" style={{ color: item.color }} /> Plot Color
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                {[1, 2, 3].map(graphNum => (
                  <div key={graphNum} className="flex flex-col items-center">
                     <label htmlFor={`plot-g${graphNum}-eq-${item.id}`} className="text-xs mb-0.5">G{graphNum}</label>
                    <Checkbox
                      id={`plot-g${graphNum}-eq-${item.id}`}
                      checked={graphNum === 1 ? item.plottedGraph1 : graphNum === 2 ? item.plottedGraph2 : item.plottedGraph3}
                      onCheckedChange={() => onTogglePlot(item.id, graphNum as 1 | 2 | 3)}
                      aria-label={`Plot on Graph ${graphNum} equation ${item.equationString}`}
                    />
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteEquation(item.id)}
                className="text-destructive hover:bg-destructive/10 ml-2"
                aria-label={`Delete equation ${item.equationString}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
