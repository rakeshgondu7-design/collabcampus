import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Users, FolderKanban, CalendarDays, Briefcase, Lightbulb, Search, TrendingUp } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/app/admin")({ component: AdminPage });

const monthlyStats = [
  { m: "Feb", users: 320, resources: 45, events: 6 },
  { m: "Mar", users: 480, resources: 78, events: 10 },
  { m: "Apr", users: 620, resources: 112, events: 12 },
  { m: "May", users: 800, resources: 168, events: 8 },
  { m: "Jun", users: 1120, resources: 240, events: 14 },
  { m: "Jul", users: 1420, resources: 312, events: 18 },
];

const mockStudents = [
  { id: "CSE21B045", name: "Aarav Sharma", dept: "CSE", year: 3, status: "Active" },
  { id: "ECE21B011", name: "Priya Nair", dept: "ECE", year: 3, status: "Active" },
  { id: "ISE22A102", name: "Rahul Menon", dept: "ISE", year: 2, status: "Active" },
  { id: "CSE20B009", name: "Sneha Iyer", dept: "CSE", year: 4, status: "Alumni" },
];

function StatMini({ icon: Icon, label, value }: any) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
        <div><div className="text-xl font-bold">{value}</div><div className="text-xs text-muted-foreground">{label}</div></div>
      </div>
    </Card>
  );
}

function AdminPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Admin Dashboard" description="Manage users, content, and campus operations" icon={Shield} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <StatMini icon={Users} label="Students" value="1,420" />
        <StatMini icon={FolderKanban} label="Resources" value="312" />
        <StatMini icon={CalendarDays} label="Events" value="18" />
        <StatMini icon={Briefcase} label="Drives" value="24" />
        <StatMini icon={Lightbulb} label="Ideas" value="87" />
        <StatMini icon={Search} label="Lost items" value="12" />
      </div>

      <Card className="mt-6 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Platform growth</div>
            <div className="text-xs text-muted-foreground">Users, resources, and events over time</div>
          </div>
          <Badge variant="secondary" className="gap-1"><TrendingUp className="h-3 w-3" /> +27% MoM</Badge>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="m" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="users" fill="hsl(230 70% 55%)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="resources" fill="hsl(210 70% 65%)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="events" fill="hsl(190 70% 60%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <Tabs defaultValue="students">
          <TabsList>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="mt-4">
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="p-3">Roll No.</th><th className="p-3">Name</th><th className="p-3">Dept</th><th className="p-3">Year</th><th className="p-3">Status</th><th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {mockStudents.map((s) => (
                    <tr key={s.id} className="border-t">
                      <td className="p-3 font-medium">{s.id}</td>
                      <td className="p-3">{s.name}</td>
                      <td className="p-3">{s.dept}</td>
                      <td className="p-3">{s.year}</td>
                      <td className="p-3"><Badge variant={s.status === "Active" ? "secondary" : "outline"}>{s.status}</Badge></td>
                      <td className="p-3 text-right"><Button size="sm" variant="ghost" onClick={() => toast.success(`Managing ${s.name}`)}>Manage</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="faculty" className="mt-4">
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                  <tr><th className="p-3">Name</th><th className="p-3">Dept</th><th className="p-3">Designation</th><th className="p-3"></th></tr>
                </thead>
                <tbody>
                  {[
                    { name: "Dr. Anitha Rao", dept: "CSE", role: "Professor" },
                    { name: "Dr. Suresh Kumar", dept: "ECE", role: "Associate Professor" },
                    { name: "Prof. Meena Iyer", dept: "ISE", role: "Assistant Professor" },
                  ].map((f) => (
                    <tr key={f.name} className="border-t">
                      <td className="p-3 font-medium">{f.name}</td>
                      <td className="p-3">{f.dept}</td>
                      <td className="p-3">{f.role}</td>
                      <td className="p-3 text-right"><Button size="sm" variant="ghost" onClick={() => toast.success(`Managing ${f.name}`)}>Manage</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="moderation" className="mt-4 space-y-3">
            {[
              { title: "Innovation Hub post flagged", ctx: "3 users reported spam" },
              { title: "Lost item pending verification", ctx: "USB drive — Lab 4" },
              { title: "Resource takedown request", ctx: "Copyright complaint" },
            ].map((m) => (
              <div key={m.title} className="flex items-center justify-between rounded-lg border p-3">
                <div><div className="text-sm font-medium">{m.title}</div><div className="text-xs text-muted-foreground">{m.ctx}</div></div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast.info(`Reviewing: ${m.title}`)}>Review</Button>
                  <Button size="sm" variant="destructive" onClick={() => toast.success(`Removed: ${m.title}`)}>Remove</Button>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
