import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, ShieldCheck, MapPin, Calendar } from "lucide-react";
import { lostFound } from "@/lib/mock-data";

export const Route = createFileRoute("/app/lost-found")({ component: LostFoundPage });

function LostFoundPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<"All" | "Lost" | "Found">("All");
  const list = lostFound.filter((i) => (type === "All" || i.type === type) && i.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Lost & Found" description="Report lost items and help others find theirs" icon={Search}
        action={<Button><Plus className="mr-1 h-4 w-4" /> Report item</Button>} />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search items…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2">
          {(["All", "Lost", "Found"] as const).map((t) => (
            <Button key={t} variant={type === t ? "default" : "outline"} size="sm" onClick={() => setType(t)}>{t}</Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((i) => (
          <Card key={i.id} className="overflow-hidden">
            <div className="h-32 bg-gradient-subtle" />
            <div className="p-4">
              <div className="flex items-center justify-between">
                <Badge variant={i.type === "Lost" ? "destructive" : "default"}>{i.type}</Badge>
                {i.verified && <Badge variant="secondary" className="gap-1"><ShieldCheck className="h-3 w-3" /> Verified</Badge>}
              </div>
              <div className="mt-2 font-semibold">{i.title}</div>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {i.location}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {i.date}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Category: {i.category}</div>
              <Button size="sm" variant="outline" className="mt-3 w-full">Contact</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
