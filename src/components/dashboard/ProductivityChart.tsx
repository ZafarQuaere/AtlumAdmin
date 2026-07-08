"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductivityDataPoint } from "@/types/dashboard";

interface ProductivityChartProps {
  data: ProductivityDataPoint[];
}

export function ProductivityChart({ data }: ProductivityChartProps) {
  const [period, setPeriod] = useState<"week" | "month">("week");

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Productivity Velocity</CardTitle>
        <div className="flex rounded-lg border border-border p-0.5">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-7 px-3 text-xs",
              period === "week" && "bg-brand-600 text-white hover:bg-brand-600"
            )}
            onClick={() => setPeriod("week")}
          >
            Week
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-7 px-3 text-xs",
              period === "month" && "bg-brand-600 text-white hover:bg-brand-600"
            )}
            onClick={() => setPeriod("month")}
          >
            Month
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                }}
              />
              <Bar
                dataKey="value"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
