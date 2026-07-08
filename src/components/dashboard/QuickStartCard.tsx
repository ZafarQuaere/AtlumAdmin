"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export function QuickStartCard() {
  return (
    <Card className="overflow-hidden animate-fade-in">
      <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
        <div className="flex-1">
          <h3 className="text-xl font-bold">Scale your team with ease</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Import hundreds of employee records, assign roles, and configure
            departments using our validated Excel engine.
          </p>
          <Button className="mt-4">
            <Upload className="h-4 w-4" />
            Bulk Employee Import
          </Button>
        </div>
        <div className="flex h-32 w-full shrink-0 items-center justify-center rounded-xl bg-primary-container sm:h-40 sm:w-48">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-emerald-600 opacity-60" />
            <p className="mt-2 text-xs font-medium text-emerald-600">
              Excel Import Engine
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
