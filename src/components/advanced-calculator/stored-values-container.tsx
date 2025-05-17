
// src/components/advanced-calculator/stored-values-container.tsx
"use client";

import type { StoredValue } from "@/app/(app)/advanced-calculator/page";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";

interface StoredValuesContainerProps {
  values: StoredValue[];
  onDeleteValue: (id: string) => void;
}

export function StoredValuesContainer({
  values,
  onDeleteValue,
}: StoredValuesContainerProps) {
  if (values.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No numeric values stored yet.</p>
        <p>Use the calculator's "Add to Storage" or direct input field.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[200px] w-full rounded-md border p-4 shadow-inner bg-muted/30">
      <div className="space-y-3">
        {values.map((item) => (
          <Card key={item.id} className="p-3 shadow-sm bg-background hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div>
                  <span className="font-medium text-sm">
                    {item.label || `Value: ${item.value}`}
                  </span>
                  {/* ID display removed from here */}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteValue(item.id)}
                className="text-destructive hover:bg-destructive/10"
                aria-label={`Delete value ${item.label}`}
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

