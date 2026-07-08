import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Configure role-based access control and permission matrices"
      />
      <Card>
        <CardContent className="flex h-64 items-center justify-center p-6">
          <p className="text-muted-foreground">
            Roles & permissions editor coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
