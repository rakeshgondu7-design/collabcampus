import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/app/notifications")({ component: NotificationsPage });

interface Notif { id: string; type: string; text: string; unread: boolean; created_at: string; link: string | null; }

function NotificationsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) toast.error(error.message);
      setItems((data as Notif[]) || []);
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel(`notifs-${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const markRead = async (id: string) => {
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, unread: false } : n));
    await supabase.from("notifications").update({ unread: false }).eq("id", id);
  };

  const markAll = async () => {
    if (!user) return;
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
    await supabase.from("notifications").update({ unread: false }).eq("user_id", user.id).eq("unread", true);
    toast.success("All marked as read");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Notifications"
        description="All your recent activity in one place"
        icon={Bell}
        action={<Button variant="outline" size="sm" onClick={markAll}><CheckCheck className="mr-1 h-4 w-4" /> Mark all read</Button>}
      />
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : items.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">
          You're all caught up. New activity will appear here in real time.
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((n) => (
            <Card
              key={n.id}
              onClick={() => n.unread && markRead(n.id)}
              className={`flex cursor-pointer items-start gap-3 p-4 ${n.unread ? "border-l-4 border-l-primary" : ""}`}
            >
              <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary">
                <Bell className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm">{n.text}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                </div>
              </div>
              {n.unread && <span className="mt-2 h-2 w-2 rounded-full bg-primary" />}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
