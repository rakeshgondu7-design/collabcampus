import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, MapPin, Users, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { events as seed } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/events")({ component: EventsPage });

const past = [
  { id: 91, title: "CodeStorm 2025", date: "2025-11-12", category: "Technical" },
  { id: 92, title: "Cultural Night — Zenith", date: "2025-10-20", category: "Cultural" },
  { id: 93, title: "Alumni Meet 2025", date: "2025-09-15", category: "Networking" },
];

type Ev = (typeof seed)[number];

function EventsPage() {
  const [items, setItems] = useState<Ev[]>(seed);
  const [registered, setRegistered] = useState<Set<number>>(new Set());
  const [detail, setDetail] = useState<Ev | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", venue: "", category: "Technical", capacity: 100 });

  const register = (e: Ev) => {
    if (registered.has(e.id)) return toast.info("Already registered");
    setRegistered(new Set([...registered, e.id]));
    setItems(items.map((x) => (x.id === e.id ? { ...x, registrations: x.registrations + 1 } : x)));
    toast.success(`Registered for ${e.title}`);
  };

  const create = () => {
    if (!form.title || !form.date) return toast.error("Title and date are required");
    const ev: Ev = { id: Date.now(), title: form.title, date: form.date, venue: form.venue || "TBA", category: form.category, capacity: Number(form.capacity), registrations: 0 };
    setItems([ev, ...items]);
    setCreating(false);
    setForm({ title: "", date: "", venue: "", category: "Technical", capacity: 100 });
    toast.success("Event created");
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Events" description="Register and never miss a campus event" icon={CalendarDays}
        action={<Button onClick={() => setCreating(true)}><Plus className="mr-1 h-4 w-4" /> Create event</Button>} />

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4 grid gap-4 md:grid-cols-2">
          {items.map((e) => (
            <Card key={e.id} className="overflow-hidden">
              <div className="h-24 bg-gradient-hero" />
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{e.title}</div>
                  <Badge variant="outline">{e.category}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {e.date}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.venue}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {e.registrations}/{e.capacity}</span>
                </div>
                <Progress className="mt-3" value={(e.registrations / e.capacity) * 100} />
                <div className="mt-4 flex gap-2">
                  <Button className="flex-1" onClick={() => register(e)} disabled={registered.has(e.id)}>
                    {registered.has(e.id) ? "Registered" : "Register"}
                  </Button>
                  <Button variant="outline" onClick={() => setDetail(e)}>Details</Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="past" className="mt-4 space-y-3">
          {past.map((p) => (
            <Card key={p.id} className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-muted-foreground">{p.date}</div>
              </div>
              <Badge variant="outline">{p.category}</Badge>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{detail?.title}</DialogTitle>
            <DialogDescription>{detail?.date} • {detail?.venue}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="flex gap-2"><Badge>{detail?.category}</Badge><Badge variant="secondary">{detail?.registrations}/{detail?.capacity} registered</Badge></div>
            <p className="text-muted-foreground">Join us for {detail?.title}. Expect keynote talks, workshops, and networking with peers from across departments. Certificates provided to all attendees.</p>
            <div className="rounded-lg border p-3 text-xs">
              <div className="font-medium">Agenda</div>
              <ul className="mt-1 list-disc pl-5 text-muted-foreground">
                <li>09:00 — Registration & breakfast</li>
                <li>10:00 — Opening keynote</li>
                <li>12:00 — Workshops</li>
                <li>16:00 — Awards & closing</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            {detail && <Button onClick={() => { register(detail); setDetail(null); }} disabled={registered.has(detail.id)}>
              {registered.has(detail.id) ? "Registered" : "Register now"}
            </Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create event</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              <div><Label>Venue</Label><Input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Category</Label>
                <select className="mt-1 h-9 w-full rounded-md border bg-background px-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {["Technical","Cultural","Sports","Workshop","Networking"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div><Label>Capacity</Label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} /></div>
            </div>
            <div><Label>Description</Label><Textarea placeholder="What is the event about?" /></div>
          </div>
          <DialogFooter><Button onClick={create}>Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
