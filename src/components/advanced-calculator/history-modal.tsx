
// src/components/advanced-calculator/history-modal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose, // Import DialogClose for a dedicated close button
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface HistoryItem {
  id: string;
  expression: string;
  result: string;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
}

export function HistoryModal({ isOpen, onClose, history }: HistoryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary">Calculation History</DialogTitle>
        </DialogHeader>
        {history.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            <p>No history yet. Perform some calculations!</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] w-full rounded-md border p-4 my-4 bg-muted/20 shadow-inner">
            <div className="space-y-3">
              {history.map((item) => (
                <Card key={item.id} className="p-3 shadow-sm bg-background hover:shadow-md transition-shadow">
                  <CardContent className="p-0"> {/* Remove CardContent padding */}
                    <p className="text-sm text-muted-foreground truncate" title={item.expression}>
                      <span className="font-semibold text-foreground">Expression:</span> {item.expression}
                    </p>
                    <p className="text-md font-semibold text-primary truncate" title={item.result}>
                      <span className="font-semibold text-foreground">Result:</span> {item.result}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
          {/* Add Clear History button here if needed in the future */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
