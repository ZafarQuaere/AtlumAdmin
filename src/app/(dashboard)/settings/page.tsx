import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Organization Settings"
        description="Configure your organization profile and system preferences"
      />
      <Card>
        <CardContent className="flex h-64 items-center justify-center p-6">
          <p className="text-muted-foreground">
            Organization settings coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
