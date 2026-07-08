"use client";

import { Calendar } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatsCards } from "@/components/dashboard/StatsCard";
import { QuickStartCard } from "@/components/dashboard/QuickStartCard";
import { ProductivityChart } from "@/components/dashboard/ProductivityChart";
import { RecentActions } from "@/components/dashboard/RecentActions";
import { Button } from "@/components/ui/button";
import { useStats } from "@/lib/hooks/useStats";
import { useRecentActions } from "@/lib/hooks/useRecentActions";
import { mockProductivityData } from "@/types/dashboard";

export default function DashboardPage() {
  const { stats, loading: statsLoading } = useStats();
  const { actions, loading: actionsLoading } = useRecentActions();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Overview"
        description="Real-time snapshots of your organization's operational health"
      >
        <Button variant="outline" size="sm">
          <Calendar className="h-4 w-4" />
          Oct 24, 2023 - Oct 30, 2023
        </Button>
      </PageHeader>

      <StatsCards stats={stats} loading={statsLoading} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <QuickStartCard />
          <ProductivityChart data={mockProductivityData} />
        </div>
        <div>
          <RecentActions actions={actions} loading={actionsLoading} />
        </div>
      </div>
    </div>
  );
}
