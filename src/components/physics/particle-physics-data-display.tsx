
// src/components/physics/particle-physics-data-display.tsx
"use client";

import { particleData, type FundamentalParticle } from "./particle-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Binary } from "lucide-react"; // Using Binary as placeholder icon

export function ParticlePhysicsDataDisplay() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center">
          <Binary className="mr-3 h-7 w-7" /> Fundamental Particles & Particle Physics
        </CardTitle>
        <CardDescription>
          Properties of some fundamental particles. (Masses and charges are illustrative).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Mass</TableHead>
              <TableHead>Charge</TableHead>
              <TableHead>Spin</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {particleData.map((particle) => (
              <TableRow key={particle.id}>
                <TableCell className="font-medium">{particle.name}</TableCell>
                <TableCell className="font-mono text-lg">{particle.symbol || 'N/A'}</TableCell>
                <TableCell>{particle.category}</TableCell>
                <TableCell>{particle.mass}</TableCell>
                <TableCell>{particle.charge}</TableCell>
                <TableCell>{particle.spin}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{particle.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-6 p-4 bg-muted/50 rounded-md">
            <h4 className="font-semibold text-primary mb-2">About Particle Physics Data</h4>
            <p className="text-sm text-muted-foreground">
                This table shows a simplified overview of some fundamental particles. Particle physics is a vast field!
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                <li>Masses are often given in units of energy (MeV/c² or GeV/c²) via E=mc².</li>
                <li>Charges are typically expressed relative to the elementary charge 'e'.</li>
                <li>Spin is an intrinsic form of angular momentum.</li>
                <li>The Standard Model of particle physics describes these particles and their interactions.</li>
            </ul>
        </div>
      </CardContent>
    </Card>
  );
}
