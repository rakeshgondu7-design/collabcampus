import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { User, Github, Linkedin, Globe, Award, FileText, Rocket, Edit3 } from "lucide-react";
import { currentUser } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/profile")({ component: ProfilePage });

function ProfilePage() {
  const [u, setU] = useState(currentUser);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(u);
  const [resume, setResume] = useState("Aarav_Sharma_Resume_v3.pdf");
  const [resumeAt, setResumeAt] = useState("2 days ago");
  const fileRef = useRef<HTMLInputElement>(null);

  const openEdit = () => { setDraft(u); setEditing(true); };
  const save = () => {
    setU({ ...draft, skills: typeof draft.skills === "string" ? (draft.skills as unknown as string).split(",").map((s) => s.trim()).filter(Boolean) : draft.skills });
    setEditing(false);
    toast.success("Profile updated");
  };

  const socials = [
    { icon: Github, href: u.github ? `https://github.com/${u.github}` : "#", label: "GitHub" },
    { icon: Linkedin, href: u.linkedin ? `https://linkedin.com/in/${u.linkedin}` : "#", label: "LinkedIn" },
    { icon: Globe, href: u.portfolio ? `https://${u.portfolio}` : "#", label: "Portfolio" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Your profile" description="Showcase your skills, projects, and achievements" icon={User}
        action={<Button variant="outline" onClick={openEdit}><Edit3 className="mr-1 h-4 w-4" /> Edit profile</Button>} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24"><AvatarImage src={u.avatar} /><AvatarFallback>{u.name.slice(0,2)}</AvatarFallback></Avatar>
            <div className="mt-4 text-lg font-semibold">{u.name}</div>
            <div className="text-sm text-muted-foreground">{u.rollNo} • {u.year}</div>
            <div className="text-xs text-muted-foreground">{u.department}</div>
            <div className="mt-4 flex gap-2">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" title={s.label} className="rounded-md border p-2 hover:bg-accent"><s.icon className="h-4 w-4" /></a>
              ))}
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-lg border p-3"><div className="text-lg font-bold">{u.cgpa}</div><div className="text-xs text-muted-foreground">CGPA</div></div>
            <div className="rounded-lg border p-3"><div className="text-lg font-bold">{u.attendance}%</div><div className="text-xs text-muted-foreground">Attendance</div></div>
          </div>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <div className="text-sm font-semibold">Skills</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {u.skills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Resume</div>
              <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
                <FileText className="mr-1 h-4 w-4" /> Upload
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setResume(f.name); setResumeAt("just now"); toast.success("Resume uploaded"); }
                }}
              />
            </div>
            <div className="mt-3 rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              {resume} • Updated {resumeAt}
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-semibold">Projects</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                { title: "Sustainable Campus Dashboard", tag: "React · MQTT" },
                { title: "AI Study Buddy", tag: "Next.js · OpenAI" },
                { title: "Hostel Mess Feedback", tag: "Flutter · Firebase" },
                { title: "Sign Language Translator", tag: "Python · TF" },
              ].map((p) => (
                <div key={p.title} className="rounded-lg border p-4">
                  <div className="flex items-center gap-2"><Rocket className="h-4 w-4 text-primary" /><span className="text-sm font-medium">{p.title}</span></div>
                  <div className="mt-1 text-xs text-muted-foreground">{p.tag}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-semibold">Certificates & Achievements</div>
            <div className="mt-3 space-y-3">
              {[
                { title: "AWS Cloud Practitioner", org: "Amazon Web Services", date: "May 2026" },
                { title: "SIH 2025 — National Finalist", org: "Ministry of Education", date: "Oct 2025" },
                { title: "Meta Frontend Certificate", org: "Coursera", date: "Feb 2025" },
              ].map((a) => (
                <div key={a.title} className="flex items-start gap-3 rounded-lg border p-3">
                  <Award className="mt-0.5 h-5 w-5 text-primary" />
                  <div><div className="text-sm font-medium">{a.title}</div><div className="text-xs text-muted-foreground">{a.org} • {a.date}</div></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit profile</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Year</Label><Input value={draft.year} onChange={(e) => setDraft({ ...draft, year: e.target.value })} /></div>
              <div><Label>Department</Label><Input value={draft.department} onChange={(e) => setDraft({ ...draft, department: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>GitHub</Label><Input value={draft.github} onChange={(e) => setDraft({ ...draft, github: e.target.value })} /></div>
              <div><Label>LinkedIn</Label><Input value={draft.linkedin} onChange={(e) => setDraft({ ...draft, linkedin: e.target.value })} /></div>
              <div><Label>Portfolio</Label><Input value={draft.portfolio} onChange={(e) => setDraft({ ...draft, portfolio: e.target.value })} /></div>
            </div>
            <div>
              <Label>Skills (comma separated)</Label>
              <Textarea
                value={Array.isArray(draft.skills) ? draft.skills.join(", ") : (draft.skills as unknown as string)}
                onChange={(e) => setDraft({ ...draft, skills: e.target.value as unknown as string[] })}
              />
            </div>
          </div>
          <DialogFooter><Button onClick={save}>Save changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
