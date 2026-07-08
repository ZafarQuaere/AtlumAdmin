import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate and export organizational reports and analytics"
      />
      <Card>
        <CardContent className="flex h-64 items-center justify-center p-6">
          <p className="text-muted-foreground">
            Reports dashboard coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
