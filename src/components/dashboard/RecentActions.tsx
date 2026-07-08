"use client";

import {
  User,
  Settings,
  Shield,
  FileText,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { RecentAction } from "@/types/dashboard";

const iconMap = {
  user: User,
  settings: Settings,
  shield: Shield,
  file: FileText,
  check: CheckCircle,
};

const categoryVariant: Record<string, "info" | "secondary" | "warning" | "success"> = {
  "HR Dept": "info",
  Settings: "secondary",
  Security: "warning",
  Automated: "success",
  Compliance: "success",
};

interface RecentActionsProps {
  actions: RecentAction[];
  loading?: boolean;
}

export function RecentActions({ actions, loading }: RecentActionsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Recent Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {actions.map((action) => {
            const Icon = iconMap[action.icon];
            return (
              <div key={action.id} className="flex items-start gap-3">
                <div className="rounded-full bg-primary-container p-2">
                  <Icon className="h-4 w-4 text-brand-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">
                    {action.title}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {action.timestamp}
                    </span>
                    <Badge
                      variant={categoryVariant[action.category] ?? "secondary"}
                      className="text-[10px]"
                    >
                      {action.category}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button className="mt-4 text-sm font-medium text-brand-600 hover:underline">
          View All Actions
        </button>
      </CardContent>
    </Card>
  );
}
