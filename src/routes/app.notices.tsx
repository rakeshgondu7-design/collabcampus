import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Megaphone, Plus, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { notices as seed } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/notices")({ component: NoticesPage });

const CATEGORIES = ["All", "College", "Department", "Placement", "Exam", "Club"];

type Notice = (typeof seed)[number];

function NoticesPage() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Notice[]>(seed);
  const [open, setOpen] = useState<Notice | null>(null);
  const [posting, setPosting] = useState(false);
  const [form, setForm] = useState({ title: "", category: "College", priority: "medium" as Notice["priority"] });

  const list = items.filter((n) => (cat === "All" || n.category === cat) && n.title.toLowerCase().includes(q.toLowerCase()));

  const publish = () => {
    if (!form.title.trim()) return toast.error("Title is required");
    const n: Notice = {
      id: Date.now(),
      title: form.title,
      category: form.category,
      priority: form.priority,
      author: "You",
      date: new Date().toISOString().slice(0, 10),
    };
    setItems([n, ...items]);
    setPosting(false);
    setForm({ title: "", category: "College", priority: "medium" });
    toast.success("Notice posted");
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Notice Board" description="Every campus notice in one place" icon={Megaphone}
        action={<Button onClick={() => setPosting(true)}><Plus className="mr-1 h-4 w-4" /> Post notice</Button>} />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search notices…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Button key={c} variant={cat === c ? "default" : "outline"} size="sm" onClick={() => setCat(c)}>{c}</Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {list.map((n) => (
          <Card key={n.id} className="p-4 transition hover:shadow-elegant">
            <div className="flex items-start gap-4">
              <Badge variant={n.priority === "high" ? "destructive" : n.priority === "medium" ? "default" : "secondary"}>{n.category}</Badge>
              <div className="flex-1">
                <div className="font-medium">{n.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">Posted by {n.author} • {n.date}</div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setOpen(n)}>Read</Button>
            </div>
          </Card>
        ))}
        {list.length === 0 && <Card className="p-10 text-center text-sm text-muted-foreground">No notices match your filters.</Card>}
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{open?.title}</DialogTitle>
            <DialogDescription>Posted by {open?.author} • {open?.date}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Badge>{open?.category}</Badge>
            <p className="text-sm text-muted-foreground">
              This notice provides important information regarding {open?.title.toLowerCase()}. Please review the details carefully and take any required action before the mentioned deadline. For queries, contact the concerned office.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={posting} onOpenChange={setPosting}>
        <DialogContent>
          <DialogHeader><DialogTitle>Post a notice</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Notice title" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <select className="mt-1 h-9 w-full rounded-md border bg-background px-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <Label>Priority</Label>
                <select className="mt-1 h-9 w-full rounded-md border bg-background px-2 text-sm" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Notice["priority"] })}>
                  <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                </select>
              </div>
            </div>
            <div><Label>Details</Label><Textarea placeholder="Describe the notice…" /></div>
          </div>
          <DialogFooter><Button onClick={publish}>Publish</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
