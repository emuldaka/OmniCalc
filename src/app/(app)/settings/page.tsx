// src/app/(app)/settings/page.tsx
"use client";

import { PrecisionSettings } from "@/components/settings/precision-settings";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary">Application Settings</CardTitle>
          <CardDescription className="text-lg">
            Customize your OmniCalc experience.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <PrecisionSettings />

      {/* Future settings can be added here as new cards/components */}
      {/* 
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Theme Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Theme customization options will be available here.</p>
        </CardContent>
      </Card>
      */}
    </div>
  );
}
