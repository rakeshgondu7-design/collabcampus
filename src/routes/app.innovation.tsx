import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Lightbulb, Heart, MessageCircle, Bookmark, EyeOff, Send } from "lucide-react";
import { ideas } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/innovation")({ component: InnovationPage });

const CATEGORIES = ["All", "Startup", "Research", "Technical", "Campus Improvement", "Academic"];

function InnovationPage() {
  const [cat, setCat] = useState("All");
  const [anon, setAnon] = useState(false);
  const [text, setText] = useState("");
  const list = ideas.filter((i) => cat === "All" || i.category === cat);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Innovation Hub" description="Share ideas, get feedback, spark change" icon={Lightbulb} />

      <Card className="mb-6 p-5">
        <div className="flex items-center gap-3">
          <Input placeholder="Give your idea a name…" />
        </div>
        <Textarea className="mt-3" placeholder="Describe your idea. What problem does it solve? Who benefits?" value={text} onChange={(e) => setText(e.target.value)} />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Switch id="anon" checked={anon} onCheckedChange={setAnon} />
            <Label htmlFor="anon" className="flex items-center gap-1.5 text-sm"><EyeOff className="h-3.5 w-3.5" /> Post anonymously</Label>
          </div>
          <Button onClick={() => { toast.success("Idea shared!"); setText(""); }}><Send className="mr-1 h-4 w-4" /> Share idea</Button>
        </div>
        {anon && <div className="mt-2 text-xs text-muted-foreground">Your identity is hidden. Only admins can view actual identity for moderation.</div>}
      </Card>

      <div className="mb-4 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Button key={c} variant={cat === c ? "default" : "outline"} size="sm" onClick={() => setCat(c)}>{c}</Button>
        ))}
      </div>

      <div className="space-y-3">
        {list.map((i) => (
          <Card key={i.id} className="p-5 transition hover:shadow-elegant">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{i.category}</Badge>
                {i.anonymous && <Badge variant="outline" className="gap-1"><EyeOff className="h-3 w-3" /> Anonymous</Badge>}
              </div>
              <div className="text-xs text-muted-foreground">by {i.author}</div>
            </div>
            <div className="mt-2 text-base font-semibold">{i.title}</div>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <button className="flex items-center gap-1 hover:text-foreground"><Heart className="h-3.5 w-3.5" /> {i.likes}</button>
              <button className="flex items-center gap-1 hover:text-foreground"><MessageCircle className="h-3.5 w-3.5" /> {i.comments}</button>
              <button className="flex items-center gap-1 hover:text-foreground"><Bookmark className="h-3.5 w-3.5" /> Save</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
