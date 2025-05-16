
// src/components/advanced-calculator/stored-equations-container.tsx
"use client";

import type { EquationItem } from "@/app/(app)/advanced-calculator/page";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, LineChart } from "lucide-react";

interface StoredEquationsContainerProps {
  equations: EquationItem[];
  onTogglePlot: (id: string) => void;
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
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={`plot-eq-${item.id}`}
                  checked={item.plotted}
                  onCheckedChange={() => onTogglePlot(item.id)}
                  aria-label={`Plot equation ${item.equationString}`}
                  className="mt-1"
                />
                <div>
                  <label
                    htmlFor={`plot-eq-${item.id}`}
                    className="font-mono text-sm cursor-pointer hover:text-primary"
                  >
                    y = {item.equationString}
                  </label>
                  <div className="flex items-center text-xs text-muted-foreground">
                     <LineChart className="h-3 w-3 mr-1.5" style={{ color: item.color }} /> Plot Color
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteEquation(item.id)}
                className="text-destructive hover:bg-destructive/10"
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
