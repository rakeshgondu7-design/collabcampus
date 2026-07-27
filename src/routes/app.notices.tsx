import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Megaphone, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/app/notices")({ component: NoticesPage });

interface Notice { id: string; title: string; body: string; category: string; priority: string; author_id: string; created_at: string; author_name?: string; }

const CATEGORIES = ["General", "Academic", "Exam", "Event", "Placement", "Sports", "Cultural"];

function NoticesPage() {
  const { user } = useAuth();
  const canPost = user && (user.role === "Faculty" || user.role === "Admin" || user.role === "Club Coordinator" || user.role === "Placement Officer");
  const [items, setItems] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ title: "", body: "", category: "General", priority: "normal" });

  const load = async () => {
    const { data, error } = await supabase
      .from("notices")
      .select("id, title, body, category, priority, author_id, created_at, profiles:author_id(name)")
      .order("created_at", { ascending: false });
    if (error) { toast.error(error.message); setLoading(false); return; }
    setItems(((data as any[]) || []).map((n) => ({ ...n, author_name: n.profiles?.name })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const ch = supabase.channel("notices-list")
      .on("postgres_changes", { event: "*", schema: "public", table: "notices" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const post = async () => {
    if (!user) return;
    if (!draft.title.trim() || !draft.body.trim()) return toast.error("Title and body are required");
    const { error } = await supabase.from("notices").insert({
      title: draft.title, body: draft.body, category: draft.category,
      priority: draft.priority as any, author_id: user.id,
    });
    if (error) return toast.error(error.message);
    toast.success("Notice posted");
    setDraft({ title: "", body: "", category: "General", priority: "normal" });
    setOpen(false);
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("notices").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Notice deleted");
  };

  const priorityColor = (p: string) =>
    p === "urgent" ? "destructive" : p === "high" ? "default" : "secondary";

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Notice Board"
        description="Official announcements from faculty, clubs and admin"
        icon={Megaphone}
        action={
          canPost && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" /> Post notice</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Post a notice</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label>Title</Label><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></div>
                  <div><Label>Body</Label><Textarea rows={5} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Category</Label>
                      <Select value={draft.category} onValueChange={(v) => setDraft({ ...draft, category: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Select value={draft.priority} onValueChange={(v) => setDraft({ ...draft, priority: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["low","normal","high","urgent"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter><Button onClick={post}>Publish</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          )
        }
      />

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading notices…</div>
      ) : items.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">
          No notices yet.{canPost ? " Be the first to post one." : ""}
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <Card key={n.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant={priorityColor(n.priority) as any}>{n.priority}</Badge>
                  <Badge variant="outline">{n.category}</Badge>
                </div>
                {user && (user.id === n.author_id || user.role === "Admin") && (
                  <Button size="icon" variant="ghost" onClick={() => remove(n.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="mt-2 text-base font-semibold">{n.title}</div>
              <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{n.body}</p>
              <div className="mt-3 text-xs text-muted-foreground">
                by {n.author_name || "Unknown"} • {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
