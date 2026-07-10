import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Users, Plus, Search, Calendar, UserPlus } from "lucide-react";
import { teamProjects } from "@/lib/mock-data";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/app/teams")({ component: TeamsPage });

function TeamsPage() {
  const [q, setQ] = useState("");
  const list = teamProjects.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()) || p.skills.join(" ").toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Team Finder"
        description="Find teammates for hackathons, projects, and research"
        icon={Users}
        action={
          <Dialog>
            <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" /> Post a project</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Post a project</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Title</Label><Input placeholder="e.g. Campus Ride Share App" /></div>
                <div><Label>Description</Label><Textarea placeholder="What are you building? Who are you looking for?" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Members needed</Label><Input type="number" defaultValue={3} /></div>
                  <div><Label>Deadline</Label><Input type="date" /></div>
                </div>
                <div><Label>Required skills (comma separated)</Label><Input placeholder="React, Node.js, Figma" /></div>
              </div>
              <DialogFooter><Button onClick={() => toast.success("Project posted!")}>Publish</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by title or skill…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {list.map((p) => (
          <Card key={p.id} className="p-5 transition hover:shadow-elegant">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold">{p.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">by {p.owner} • {p.applicants} applicants</div>
              </div>
              <Badge>{p.status}</Badge>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{p.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.skills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
            </div>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><UserPlus className="h-3 w-3" /> {p.needed} slots open</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {p.deadline}</span>
              </div>
              <Progress value={((5 - p.needed) / 5) * 100} />
            </div>
            <div className="mt-4 flex gap-2">
              <Button className="flex-1" onClick={() => toast.success(`Applied to ${p.title}`)}>Apply</Button>
              <Button variant="outline" onClick={() => toast.info(`Viewing ${p.title}`)}>View</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
