import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Megaphone, Plus, Search } from "lucide-react";
import { notices } from "@/lib/mock-data";

export const Route = createFileRoute("/app/notices")({ component: NoticesPage });

const CATEGORIES = ["All", "College", "Department", "Placement", "Exam", "Club"];

function NoticesPage() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const list = notices.filter((n) => (cat === "All" || n.category === cat) && n.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Notice Board" description="Every campus notice in one place" icon={Megaphone}
        action={<Button><Plus className="mr-1 h-4 w-4" /> Post notice</Button>} />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search notices…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Button key={c} variant={cat === c ? "default" : "outline"} size="sm" onClick={() => setCat(c)}>{c}</Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {list.map((n) => (
          <Card key={n.id} className="p-4 transition hover:shadow-elegant">
            <div className="flex items-start gap-4">
              <Badge variant={n.priority === "high" ? "destructive" : n.priority === "medium" ? "default" : "secondary"}>{n.category}</Badge>
              <div className="flex-1">
                <div className="font-medium">{n.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">Posted by {n.author} • {n.date}</div>
              </div>
              <Button variant="ghost" size="sm">Read</Button>
            </div>
          </Card>
        ))}
        {list.length === 0 && <Card className="p-10 text-center text-sm text-muted-foreground">No notices match your filters.</Card>}
      </div>
    </div>
  );
}
