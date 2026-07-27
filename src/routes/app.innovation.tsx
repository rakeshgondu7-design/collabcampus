import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Lightbulb, Heart, EyeOff, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/app/innovation")({ component: InnovationPage });

const CATEGORIES = ["All", "Startup", "Research", "Technical", "Campus Improvement", "Academic"];

interface Idea {
  id: string; title: string; description: string; category: string; anonymous: boolean;
  author_id: string | null; author_name: string | null; likes_count: number; liked_by_me: boolean; created_at: string;
}

function InnovationPage() {
  const { user } = useAuth();
  const [cat, setCat] = useState("All");
  const [anon, setAnon] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Startup");
  const [items, setItems] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data, error } = await supabase.from("ideas_public").select("*").order("created_at", { ascending: false });
    if (error) { toast.error(error.message); setLoading(false); return; }
    setItems((data as Idea[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const post = async () => {
    if (!user) return;
    if (!title.trim() || !text.trim()) return toast.error("Give your idea a title and description");
    const { error } = await supabase.from("ideas").insert({
      author_id: user.id, title, description: text, category, anonymous: anon,
    });
    if (error) return toast.error(error.message);
    toast.success("Idea shared!");
    setTitle(""); setText(""); load();
  };

  const toggleLike = async (idea: Idea) => {
    if (!user) return;
    if (idea.liked_by_me) {
      await supabase.from("idea_likes").delete().eq("idea_id", idea.id).eq("user_id", user.id);
    } else {
      await supabase.from("idea_likes").insert({ idea_id: idea.id, user_id: user.id });
    }
    setItems((prev) => prev.map((i) => i.id === idea.id
      ? { ...i, liked_by_me: !i.liked_by_me, likes_count: i.likes_count + (i.liked_by_me ? -1 : 1) }
      : i));
  };

  const list = items.filter((i) => cat === "All" || i.category === cat);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Innovation Hub" description="Share ideas, get feedback, spark change" icon={Lightbulb} />

      <Card className="mb-6 p-5">
        <Input placeholder="Give your idea a name…" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea className="mt-3" placeholder="Describe your idea. What problem does it solve? Who benefits?" value={text} onChange={(e) => setText(e.target.value)} />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch id="anon" checked={anon} onCheckedChange={setAnon} />
              <Label htmlFor="anon" className="flex items-center gap-1.5 text-sm"><EyeOff className="h-3.5 w-3.5" /> Post anonymously</Label>
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-md border bg-background px-3 py-1.5 text-sm">
              {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Button onClick={post}><Send className="mr-1 h-4 w-4" /> Share idea</Button>
        </div>
        {anon && <div className="mt-2 text-xs text-muted-foreground">Your identity is hidden. Only admins can view actual identity for moderation.</div>}
      </Card>

      <div className="mb-4 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Button key={c} variant={cat === c ? "default" : "outline"} size="sm" onClick={() => setCat(c)}>{c}</Button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading ideas…</div>
      ) : list.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">No ideas in this category yet.</Card>
      ) : (
        <div className="space-y-3">
          {list.map((i) => (
            <Card key={i.id} className="p-5 transition hover:shadow-elegant">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{i.category}</Badge>
                  {i.anonymous && <Badge variant="outline" className="gap-1"><EyeOff className="h-3 w-3" /> Anonymous</Badge>}
                </div>
                <div className="text-xs text-muted-foreground">by {i.author_name || "Anonymous"}</div>
              </div>
              <div className="mt-2 text-base font-semibold">{i.title}</div>
              <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{i.description}</p>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <button onClick={() => toggleLike(i)} className={`flex items-center gap-1 hover:text-foreground ${i.liked_by_me ? "text-primary" : ""}`}>
                  <Heart className={`h-3.5 w-3.5 ${i.liked_by_me ? "fill-primary" : ""}`} /> {i.likes_count}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
