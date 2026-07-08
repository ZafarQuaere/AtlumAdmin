"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCog, Activity, TrendingUp } from "lucide-react";
import type { DashboardStats } from "@/types/dashboard";

interface StatsCardProps {
  stats: DashboardStats;
  loading?: boolean;
}

export function StatsCards({ stats, loading }: StatsCardProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-4 h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3 animate-fade-in">
      <Card>
        <CardContent className="flex items-start justify-between p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Employees
            </p>
            <p className="mt-2 text-3xl font-bold">
              {stats.totalEmployees.value.toLocaleString()}
            </p>
            <div className="mt-2 flex items-center gap-1 text-sm text-success">
              <TrendingUp className="h-4 w-4" />
              <span>+{stats.totalEmployees.change}%</span>
            </div>
          </div>
          <div className="rounded-lg bg-primary-container p-3">
            <Users className="h-5 w-5 text-brand-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-start justify-between p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Active Managers
            </p>
            <p className="mt-2 text-3xl font-bold">
              {stats.activeManagers.value}
            </p>
            <Badge variant="secondary" className="mt-2">
              {stats.activeManagers.status}
            </Badge>
          </div>
          <div className="rounded-lg bg-secondary p-3">
            <UserCog className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                System Health
              </p>
              <p className="mt-2 text-3xl font-bold text-success">
                {stats.systemHealth.uptime}
              </p>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
            <div className="rounded-lg bg-primary-container p-3">
              <Activity className="h-5 w-5 text-brand-600" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>{stats.systemHealth.latency} Latency</span>
            <span>{stats.systemHealth.errors} Critical Errors</span>
            <Badge variant="success">{stats.systemHealth.status} Sync Status</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
