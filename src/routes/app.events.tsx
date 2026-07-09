import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, MapPin, Users, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { events } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/events")({ component: EventsPage });

const past = [
  { id: 91, title: "CodeStorm 2025", date: "2025-11-12", category: "Technical" },
  { id: 92, title: "Cultural Night — Zenith", date: "2025-10-20", category: "Cultural" },
  { id: 93, title: "Alumni Meet 2025", date: "2025-09-15", category: "Networking" },
];

function EventsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Events" description="Register and never miss a campus event" icon={CalendarDays}
        action={<Button><Plus className="mr-1 h-4 w-4" /> Create event</Button>} />

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4 grid gap-4 md:grid-cols-2">
          {events.map((e) => (
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
                  <Button className="flex-1" onClick={() => toast.success(`Registered for ${e.title}`)}>Register</Button>
                  <Button variant="outline">Details</Button>
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

      <Card className="mt-6 p-4 text-xs text-muted-foreground">
        📱 Coming soon: QR-code based event attendance.
      </Card>
    </div>
  );
}
