import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Github, Linkedin, Globe, Award, FileText, Rocket, Edit3 } from "lucide-react";
import { currentUser } from "@/lib/mock-data";

export const Route = createFileRoute("/app/profile")({ component: ProfilePage });

function ProfilePage() {
  const u = currentUser;
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Your profile" description="Showcase your skills, projects, and achievements" icon={User}
        action={<Button variant="outline"><Edit3 className="mr-1 h-4 w-4" /> Edit profile</Button>} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24"><AvatarImage src={u.avatar} /><AvatarFallback>{u.name.slice(0,2)}</AvatarFallback></Avatar>
            <div className="mt-4 text-lg font-semibold">{u.name}</div>
            <div className="text-sm text-muted-foreground">{u.rollNo} • {u.year}</div>
            <div className="text-xs text-muted-foreground">{u.department}</div>
            <div className="mt-4 flex gap-2">
              <a href="#" className="rounded-md border p-2 hover:bg-accent"><Github className="h-4 w-4" /></a>
              <a href="#" className="rounded-md border p-2 hover:bg-accent"><Linkedin className="h-4 w-4" /></a>
              <a href="#" className="rounded-md border p-2 hover:bg-accent"><Globe className="h-4 w-4" /></a>
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
              <Button size="sm" variant="outline"><FileText className="mr-1 h-4 w-4" /> Upload</Button>
            </div>
            <div className="mt-3 rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Aarav_Sharma_Resume_v3.pdf • Updated 2 days ago
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
    </div>
  );
}
