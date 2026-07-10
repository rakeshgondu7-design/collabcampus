import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Plus, ShieldCheck, MapPin, Calendar, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { lostFound as seed } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/lost-found")({ component: LostFoundPage });

type Item = (typeof seed)[number];

function LostFoundPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<"All" | "Lost" | "Found">("All");
  const [items, setItems] = useState<Item[]>(seed);
  const [reporting, setReporting] = useState(false);
  const [contact, setContact] = useState<Item | null>(null);
  const [form, setForm] = useState({ title: "", type: "Lost" as "Lost" | "Found", category: "Electronics", location: "" });

  const list = items.filter((i) => (type === "All" || i.type === type) && i.title.toLowerCase().includes(q.toLowerCase()));

  const submit = () => {
    if (!form.title || !form.location) return toast.error("Title and location are required");
    setItems([{ id: Date.now(), title: form.title, type: form.type, category: form.category, location: form.location, date: new Date().toISOString().slice(0,10), verified: false } as Item, ...items]);
    setReporting(false);
    setForm({ title: "", type: "Lost", category: "Electronics", location: "" });
    toast.success("Item reported");
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Lost & Found" description="Report lost items and help others find theirs" icon={Search}
        action={<Button onClick={() => setReporting(true)}><Plus className="mr-1 h-4 w-4" /> Report item</Button>} />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search items…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2">
          {(["All", "Lost", "Found"] as const).map((t) => (
            <Button key={t} variant={type === t ? "default" : "outline"} size="sm" onClick={() => setType(t)}>{t}</Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((i) => (
          <Card key={i.id} className="overflow-hidden">
            <div className="h-32 bg-gradient-subtle" />
            <div className="p-4">
              <div className="flex items-center justify-between">
                <Badge variant={i.type === "Lost" ? "destructive" : "default"}>{i.type}</Badge>
                {i.verified && <Badge variant="secondary" className="gap-1"><ShieldCheck className="h-3 w-3" /> Verified</Badge>}
              </div>
              <div className="mt-2 font-semibold">{i.title}</div>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {i.location}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {i.date}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Category: {i.category}</div>
              <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => setContact(i)}>Contact</Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={reporting} onOpenChange={setReporting}>
        <DialogContent>
          <DialogHeader><DialogTitle>Report an item</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Black Wallet" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Type</Label>
                <select className="mt-1 h-9 w-full rounded-md border bg-background px-2 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "Lost" | "Found" })}>
                  <option>Lost</option><option>Found</option>
                </select>
              </div>
              <div><Label>Category</Label>
                <select className="mt-1 h-9 w-full rounded-md border bg-background px-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {["Electronics","Books","Accessories","Documents","Clothing","Other"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Library, 2nd floor" /></div>
            <div><Label>Details</Label><Textarea placeholder="Describe the item — color, distinguishing marks, etc." /></div>
          </div>
          <DialogFooter><Button onClick={submit}>Report</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!contact} onOpenChange={(v) => !v && setContact(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact reporter</DialogTitle>
            <DialogDescription>{contact?.title} • {contact?.location}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 font-medium"><Mail className="h-4 w-4 text-primary" /> reporter@campus.edu</div>
              <div className="mt-1 text-xs text-muted-foreground">Reporter will be notified when you send a message.</div>
            </div>
            <Textarea placeholder="Hi, I think I found/lost this item…" />
          </div>
          <DialogFooter>
            <Button onClick={() => { toast.success("Message sent"); setContact(null); }}>Send message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
