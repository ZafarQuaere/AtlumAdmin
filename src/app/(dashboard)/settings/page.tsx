import { TaskConfigurationForm } from "@/components/settings/TaskConfigurationForm";
import { WhatsAppSettingsCard } from "@/components/settings/WhatsAppSettingsCard";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <TaskConfigurationForm />
      <WhatsAppSettingsCard />
    </div>
  );
}
