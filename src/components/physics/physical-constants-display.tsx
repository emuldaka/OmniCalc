
// src/components/physics/physical-constants-display.tsx
"use client";

import { physicalConstantsData, type PhysicalConstant } from "./physical-constants-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy, SigmaIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function PhysicalConstantsDisplay() {
  const { toast } = useToast();

  const handleCopy = (constant: PhysicalConstant) => {
    navigator.clipboard.writeText(constant.value.toString())
      .then(() => {
        toast({
          title: "Copied to Clipboard!",
          description: `${constant.name} (${constant.symbol}) value: ${constant.value.toExponential(4)} ${constant.unit}`,
        });
      })
      .catch(err => {
        toast({
          variant: "destructive",
          title: "Copy Failed",
          description: "Could not copy value to clipboard.",
        });
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center">
          <SigmaIcon className="mr-3 h-7 w-7" /> Physical Constants
        </CardTitle>
        <CardDescription>
          A quick reference for some fundamental physical constants. Click to copy value.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {physicalConstantsData.map((constant) => (
              <TableRow key={constant.id}>
                <TableCell className="font-medium">{constant.name}</TableCell>
                <TableCell className="font-mono text-lg">{constant.symbol}</TableCell>
                <TableCell className="font-mono">{constant.value.toExponential(6)}</TableCell>
                <TableCell>{constant.unit}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleCopy(constant)} title={`Copy ${constant.name} value`}>
                    <Copy className="mr-2 h-4 w-4" /> Copy Value
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
