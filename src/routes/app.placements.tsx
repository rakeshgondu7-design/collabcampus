import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Building2, CalendarDays, IndianRupee, GraduationCap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { placements } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/placements")({ component: PlacementsPage });

const prep = [
  { title: "System Design Primer", subtitle: "Curated from FAANG interviews" },
  { title: "DSA — 150 Must-Do Problems", subtitle: "Sorted by frequency" },
  { title: "Behavioral Interview Handbook", subtitle: "STAR method + real questions" },
  { title: "Aptitude & Quant — Cracked", subtitle: "Speed drills + shortcuts" },
];
const tracker = [
  { company: "Google", stage: "Online Assessment", status: "In Progress" },
  { company: "Microsoft", stage: "Applied", status: "Under review" },
  { company: "Amazon", stage: "Shortlisted", status: "Interview scheduled" },
];

function PlacementsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Placement Hub" description="Companies, prep resources, and your application tracker" icon={Briefcase} />

      <Tabs defaultValue="companies">
        <TabsList>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="prep">Preparation</TabsTrigger>
          <TabsTrigger value="tracker">My Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="companies" className="mt-4 grid gap-4 md:grid-cols-2">
          {placements.map((p) => (
            <Card key={p.id} className="p-5 transition hover:shadow-elegant">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary"><Building2 className="h-5 w-5" /></div>
                  <div>
                    <div className="font-semibold">{p.company}</div>
                    <div className="text-xs text-muted-foreground">{p.role}</div>
                  </div>
                </div>
                <Badge variant={p.status === "Closing Soon" ? "destructive" : "secondary"}>{p.status}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div className="rounded-lg border p-2"><IndianRupee className="mb-1 h-3 w-3 text-primary" /><div className="font-semibold">{p.package}</div><div className="text-muted-foreground">Package</div></div>
                <div className="rounded-lg border p-2"><GraduationCap className="mb-1 h-3 w-3 text-primary" /><div className="font-semibold">{p.cgpa}+</div><div className="text-muted-foreground">Min CGPA</div></div>
                <div className="rounded-lg border p-2"><CalendarDays className="mb-1 h-3 w-3 text-primary" /><div className="font-semibold">{p.deadline}</div><div className="text-muted-foreground">Deadline</div></div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Eligibility: {p.eligibility}</div>
              <Button className="mt-4 w-full" onClick={() => toast.success(`Applied to ${p.company}`)}>Apply now</Button>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="prep" className="mt-4 grid gap-4 md:grid-cols-2">
          {prep.map((p) => (
            <Card key={p.title} className="p-5">
              <div className="font-semibold">{p.title}</div>
              <div className="text-xs text-muted-foreground">{p.subtitle}</div>
              <Button variant="outline" size="sm" className="mt-3">Open</Button>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tracker" className="mt-4 space-y-3">
          {tracker.map((t) => (
            <Card key={t.company} className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium">{t.company}</div>
                <div className="text-xs text-muted-foreground">Stage: {t.stage}</div>
              </div>
              <Badge variant="secondary">{t.status}</Badge>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
