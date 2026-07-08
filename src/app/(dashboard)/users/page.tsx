import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage employee accounts, roles, and access control"
      />
      <Card>
        <CardContent className="flex h-64 items-center justify-center p-6">
          <p className="text-muted-foreground">
            User management interface coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
