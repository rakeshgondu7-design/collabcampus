import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, CalendarDays, Sun } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { assignments } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/academics")({ component: AcademicsPage });

const examSchedule = [
  { subject: "Operating Systems", date: "2026-07-22", time: "10:00 AM", venue: "Hall A" },
  { subject: "DBMS", date: "2026-07-24", time: "2:00 PM", venue: "Hall B" },
  { subject: "Computer Networks", date: "2026-07-26", time: "10:00 AM", venue: "Hall A" },
  { subject: "Machine Learning", date: "2026-07-28", time: "2:00 PM", venue: "Hall C" },
];
const holidays = [
  { name: "Independence Day", date: "2026-08-15" },
  { name: "Ganesh Chaturthi", date: "2026-09-05" },
  { name: "Gandhi Jayanti", date: "2026-10-02" },
  { name: "Diwali Break", date: "2026-11-01 to 2026-11-05" },
];

function AcademicsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Academic Updates" description="Exams, assignments, calendar, and holidays" icon={BookOpen} />
      <Tabs defaultValue="exams">
        <TabsList>
          <TabsTrigger value="exams">Exam Schedule</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="calendar">Academic Calendar</TabsTrigger>
          <TabsTrigger value="holidays">Holidays</TabsTrigger>
        </TabsList>

        <TabsContent value="exams" className="mt-4 space-y-3">
          {examSchedule.map((e) => (
            <Card key={e.subject} className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium">{e.subject}</div>
                <div className="text-xs text-muted-foreground">{e.date} • {e.time} • {e.venue}</div>
              </div>
              <Badge variant="secondary"><CalendarDays className="mr-1 h-3 w-3" /> Upcoming</Badge>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="assignments" className="mt-4 space-y-3">
          {assignments.map((a) => (
            <Card key={a.id} className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium">{a.title}</div>
                <div className="text-xs text-muted-foreground">{a.subject} • Due {a.due}</div>
              </div>
              <Badge variant={a.status === "Submitted" ? "secondary" : "default"}>{a.status}</Badge>
              <Button variant="outline" size="sm" onClick={() => toast.info(`Opening ${a.title}`)}>Open</Button>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="calendar" className="mt-4">
          <Card className="p-6">
            <div className="text-sm font-semibold">Semester 6 · 2026</div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {[
                { evt: "Semester begins", d: "2026-02-05" },
                { evt: "Mid-semester exams", d: "2026-07-22 to 2026-07-30" },
                { evt: "Project reviews", d: "2026-09-15" },
                { evt: "End-semester exams", d: "2026-11-20 to 2026-12-05" },
              ].map((c) => (
                <div key={c.evt} className="rounded-lg border p-3">
                  <div className="text-sm font-medium">{c.evt}</div>
                  <div className="text-xs text-muted-foreground">{c.d}</div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="holidays" className="mt-4 space-y-3">
          {holidays.map((h) => (
            <Card key={h.name} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3"><Sun className="h-4 w-4 text-warning" /><div className="font-medium">{h.name}</div></div>
              <div className="text-sm text-muted-foreground">{h.date}</div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
