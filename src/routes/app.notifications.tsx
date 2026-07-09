import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Bell, Users, Briefcase, CalendarDays, Megaphone, Lightbulb, Search } from "lucide-react";
import { notifications } from "@/lib/mock-data";

export const Route = createFileRoute("/app/notifications")({ component: NotificationsPage });

const iconMap: Record<string, any> = {
  team: Users, placement: Briefcase, event: CalendarDays,
  notice: Megaphone, idea: Lightbulb, lost: Search,
};

function NotificationsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Notifications" description="All your recent activity in one place" icon={Bell} />
      <div className="space-y-2">
        {notifications.map((n) => {
          const I = iconMap[n.type] ?? Bell;
          return (
            <Card key={n.id} className={`flex items-start gap-3 p-4 ${n.unread ? "border-l-4 border-l-primary" : ""}`}>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary"><I className="h-4 w-4" /></div>
              <div className="flex-1">
                <div className="text-sm">{n.text}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{n.time}</div>
              </div>
              {n.unread && <span className="mt-2 h-2 w-2 rounded-full bg-primary" />}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
