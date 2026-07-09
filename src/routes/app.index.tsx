import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  LayoutDashboard, CalendarCheck, Megaphone, CalendarDays, FolderKanban, Briefcase,
  ArrowUpRight, Users, Lightbulb, Plus, TrendingUp,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { notices, events, resources, placements, attendanceTrend, teamProjects } from "@/lib/mock-data";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/app/")({ component: Dashboard });

function StatCard({ icon: Icon, label, value, delta, tone = "primary" }: { icon: any; label: string; value: string; delta?: string; tone?: "primary" | "success" | "warning" }) {
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning-foreground",
  };
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className={`grid h-10 w-10 place-items-center rounded-lg ${tones[tone]}`}><Icon className="h-5 w-5" /></div>
        {delta && <span className="flex items-center gap-1 text-xs text-success"><TrendingUp className="h-3 w-3" />{delta}</span>}
      </div>
      <div className="mt-4 text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </Card>
  );
}

function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title={`Welcome back, ${user?.name.split(" ")[0] ?? "friend"} 👋`}
        description="Here's what's happening across your campus today."
        icon={LayoutDashboard}
        action={<Button asChild><Link to="/app/teams"><Plus className="mr-1 h-4 w-4" /> New project</Link></Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarCheck} label="Attendance" value="87%" delta="+3%" tone="success" />
        <StatCard icon={Megaphone} label="New notices" value="6" delta="+2" />
        <StatCard icon={CalendarDays} label="Upcoming events" value="5" />
        <StatCard icon={Briefcase} label="Open placement drives" value="12" tone="warning" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Attendance trend</div>
              <div className="text-xs text-muted-foreground">Last 6 months</div>
            </div>
            <Badge variant="secondary">Overall 87%</Badge>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrend}>
                <defs>
                  <linearGradient id="atd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(230 70% 60%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(230 70% 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" stroke="currentColor" fontSize={12} />
                <YAxis stroke="currentColor" fontSize={12} domain={[60, 100]} />
                <Tooltip contentStyle={{ borderRadius: 8, borderColor: "hsl(230 20% 90%)" }} />
                <Area type="monotone" dataKey="percent" stroke="hsl(230 70% 55%)" fill="url(#atd)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Quick actions</div>
          </div>
          <div className="mt-4 grid gap-2">
            {[
              { to: "/app/teams", icon: Users, label: "Find a team" },
              { to: "/app/resources", icon: FolderKanban, label: "Upload resource" },
              { to: "/app/innovation", icon: Lightbulb, label: "Share an idea" },
              { to: "/app/placements", icon: Briefcase, label: "Browse placements" },
            ].map((a) => {
              const I = a.icon;
              return (
                <Link key={a.to} to={a.to} className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-accent">
                  <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary"><I className="h-4 w-4" /></div>
                  <span className="text-sm font-medium">{a.label}</span>
                  <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
                </Link>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-semibold">Latest notices</div>
            <Button asChild variant="ghost" size="sm"><Link to="/app/notices">View all</Link></Button>
          </div>
          <div className="space-y-3">
            {notices.slice(0, 4).map((n) => (
              <div key={n.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                <Badge variant={n.priority === "high" ? "destructive" : "secondary"} className="mt-0.5">{n.category}</Badge>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{n.author} • {n.date}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-semibold">Upcoming events</div>
            <Button asChild variant="ghost" size="sm"><Link to="/app/events">View all</Link></Button>
          </div>
          <div className="space-y-3">
            {events.slice(0, 4).map((e) => (
              <div key={e.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-hero text-white">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium">{e.title}</div>
                  <div className="text-xs text-muted-foreground">{e.date} • {e.venue}</div>
                </div>
                <Badge variant="outline">{e.category}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-semibold">Recent resources</div>
            <Button asChild variant="ghost" size="sm"><Link to="/app/resources">View all</Link></Button>
          </div>
          <div className="space-y-3">
            {resources.slice(0, 4).map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Badge variant="secondary">{r.type}</Badge>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium">{r.title}</div>
                  <div className="text-xs text-muted-foreground">{r.subject} • ⭐ {r.rating} • {r.downloads} downloads</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-semibold">Placement deadlines</div>
            <Button asChild variant="ghost" size="sm"><Link to="/app/placements">View all</Link></Button>
          </div>
          <div className="space-y-3">
            {placements.slice(0, 4).map((p) => (
              <div key={p.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{p.company} — {p.role}</div>
                  <Badge variant={p.status === "Closing Soon" ? "destructive" : "secondary"}>{p.status}</Badge>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{p.package} • CGPA ≥ {p.cgpa} • Deadline {p.deadline}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Open team projects</div>
            <div className="text-xs text-muted-foreground">Find a project matching your skills</div>
          </div>
          <Button asChild variant="ghost" size="sm"><Link to="/app/teams">Explore all</Link></Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {teamProjects.slice(0, 2).map((p) => (
            <div key={p.id} className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">{p.title}</div>
                <Badge>{p.status}</Badge>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">by {p.owner} • {p.applicants} applicants</div>
              <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.skills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
              </div>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Members needed</span><span>{p.needed} open</span>
                </div>
                <Progress value={((5 - p.needed) / 5) * 100} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
