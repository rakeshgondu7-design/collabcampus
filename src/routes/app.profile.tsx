import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { User, Github, Linkedin, Globe, FileText, Edit3, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/app/profile")({ component: ProfilePage });

interface Profile {
  id: string; name: string; email: string; department: string | null; year: string | null;
  bio: string | null; phone: string | null; github: string | null; linkedin: string | null;
  portfolio: string | null; avatar_url: string | null; resume_url: string | null;
}

function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const resumeRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (error) toast.error(error.message);
      setProfile(data as Profile);
      setLoading(false);
    })();
  }, [user]);

  const openEdit = () => { setDraft(profile); setEditing(true); };

  const save = async () => {
    if (!draft || !user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      name: draft.name, department: draft.department, year: draft.year, bio: draft.bio,
      phone: draft.phone, github: draft.github, linkedin: draft.linkedin, portfolio: draft.portfolio,
    }).eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    setProfile(draft);
    setEditing(false);
    toast.success("Profile updated");
  };

  const uploadFile = async (file: File, kind: "avatar" | "resume") => {
    if (!user) return null;
    // Files stored as data URLs on profile row for Phase 1 (Storage buckets come in Phase 2).
    if (file.size > 2 * 1024 * 1024) return toast.error("File must be under 2MB");
    const reader = new FileReader();
    reader.onload = async () => {
      const url = reader.result as string;
      const patch = kind === "avatar" ? { avatar_url: url } : { resume_url: url };
      const { error } = await supabase.from("profiles").update(patch).eq("id", user.id);
      const field = kind === "avatar" ? "avatar_url" : "resume_url";
      if (error) return toast.error(error.message);
      setProfile((p) => p ? { ...p, [field]: url } as Profile : p);
      toast.success(`${kind === "avatar" ? "Avatar" : "Resume"} uploaded`);
    };
    reader.readAsDataURL(file);
  };

  if (loading || !profile) {
    return <div className="text-sm text-muted-foreground">Loading profile…</div>;
  }

  const socials = [
    { icon: Github, href: profile.github ? `https://github.com/${profile.github}` : null, label: "GitHub" },
    { icon: Linkedin, href: profile.linkedin ? `https://linkedin.com/in/${profile.linkedin}` : null, label: "LinkedIn" },
    { icon: Globe, href: profile.portfolio ? (profile.portfolio.startsWith("http") ? profile.portfolio : `https://${profile.portfolio}`) : null, label: "Portfolio" },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Your profile" description="Manage your information and links" icon={User}
        action={<Button variant="outline" onClick={openEdit}><Edit3 className="mr-1 h-4 w-4" /> Edit profile</Button>} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar_url ?? undefined} />
                <AvatarFallback>{profile.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <button onClick={() => avatarRef.current?.click()} className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full border bg-background text-primary shadow-sm hover:bg-accent">
                <Upload className="h-3.5 w-3.5" />
              </button>
              <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f, "avatar"); }} />
            </div>
            <div className="mt-4 text-lg font-semibold">{profile.name}</div>
            <div className="text-sm text-muted-foreground">{profile.email}</div>
            {(profile.year || profile.department) && (
              <div className="mt-1 text-xs text-muted-foreground">{[profile.year, profile.department].filter(Boolean).join(" • ")}</div>
            )}
            <div className="mt-4 flex gap-2">
              {socials.map((s) => s.href ? (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" title={s.label} className="rounded-md border p-2 hover:bg-accent"><s.icon className="h-4 w-4" /></a>
              ) : (
                <span key={s.label} title={`Add ${s.label}`} className="rounded-md border p-2 opacity-40"><s.icon className="h-4 w-4" /></span>
              ))}
            </div>
          </div>
          {profile.bio && (
            <div className="mt-6 rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground whitespace-pre-wrap">{profile.bio}</div>
          )}
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Resume</div>
              <Button size="sm" variant="outline" onClick={() => resumeRef.current?.click()}>
                <FileText className="mr-1 h-4 w-4" /> {profile.resume_url ? "Replace" : "Upload"}
              </Button>
              <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f, "resume"); }} />
            </div>
            <div className="mt-3 rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              {profile.resume_url ? (
                <a href={profile.resume_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">View uploaded resume</a>
              ) : (
                "No resume uploaded yet."
              )}
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-semibold">Contact</div>
            <dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-xs text-muted-foreground">Email</dt><dd>{profile.email}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Phone</dt><dd>{profile.phone || "—"}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Department</dt><dd>{profile.department || "—"}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Year</dt><dd>{profile.year || "—"}</dd></div>
            </dl>
          </Card>
        </div>
      </div>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit profile</DialogTitle></DialogHeader>
          {draft && (
            <div className="space-y-3">
              <div><Label>Name</Label><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
              <div><Label>Bio</Label><Textarea value={draft.bio ?? ""} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Year</Label><Input value={draft.year ?? ""} onChange={(e) => setDraft({ ...draft, year: e.target.value })} /></div>
                <div><Label>Department</Label><Input value={draft.department ?? ""} onChange={(e) => setDraft({ ...draft, department: e.target.value })} /></div>
              </div>
              <div><Label>Phone</Label><Input value={draft.phone ?? ""} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>GitHub</Label><Input placeholder="username" value={draft.github ?? ""} onChange={(e) => setDraft({ ...draft, github: e.target.value })} /></div>
                <div><Label>LinkedIn</Label><Input placeholder="username" value={draft.linkedin ?? ""} onChange={(e) => setDraft({ ...draft, linkedin: e.target.value })} /></div>
                <div><Label>Portfolio</Label><Input placeholder="yoursite.com" value={draft.portfolio ?? ""} onChange={(e) => setDraft({ ...draft, portfolio: e.target.value })} /></div>
              </div>
            </div>
          )}
          <DialogFooter><Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
