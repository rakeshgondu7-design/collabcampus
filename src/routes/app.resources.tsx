import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderKanban, Upload, Download, Bookmark, Heart, Star, MessageCircle, Search } from "lucide-react";
import { resources } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/resources")({ component: ResourcesPage });

function ResourcesPage() {
  const [q, setQ] = useState("");
  const list = resources.filter((r) => r.title.toLowerCase().includes(q.toLowerCase()) || r.subject.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Resource Hub" description="Notes, PPTs, lab code, previous papers — shared by students" icon={FolderKanban}
        action={<Button onClick={() => toast.success("Upload dialog would open")}><Upload className="mr-1 h-4 w-4" /> Upload resource</Button>} />

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search notes, subjects, uploaders…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => (
          <Card key={r.id} className="p-5 transition hover:shadow-elegant">
            <div className="flex items-start justify-between">
              <Badge variant="secondary">{r.type}</Badge>
              <div className="flex items-center gap-1 text-xs text-warning-foreground"><Star className="h-3.5 w-3.5 fill-warning text-warning" /> {r.rating}</div>
            </div>
            <div className="mt-3 font-semibold leading-tight">{r.title}</div>
            <div className="mt-1 text-xs text-muted-foreground">{r.subject} • by {r.uploader}</div>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Download className="h-3.5 w-3.5" /> {r.downloads}</span>
              <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {r.likes}</span>
              <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> 12</span>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" className="flex-1"><Download className="mr-1 h-3.5 w-3.5" /> Download</Button>
              <Button size="sm" variant="outline"><Bookmark className="h-3.5 w-3.5" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
