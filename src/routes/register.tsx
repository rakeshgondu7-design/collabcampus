import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, type Role } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function RegisterPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Student" as Role });
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.name) return toast.error("Fill all fields");
    setLoading(true);
    setTimeout(() => {
      signIn(form.email, form.password, form.role);
      toast.success("Account created! Welcome to Campus Connect.");
      navigate({ to: "/app" });
    }, 400);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-hero lg:block">
        <div className="absolute inset-0 grid place-items-center p-12">
          <div className="max-w-md text-white">
            <div className="text-sm font-medium uppercase tracking-wider text-white/70">Join today</div>
            <h2 className="mt-3 text-3xl font-bold leading-tight">Your campus, connected.</h2>
            <p className="mt-4 text-white/85">Create your workspace in under a minute and start collaborating.</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Logo />
          <h1 className="mt-8 text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Get started with your college email.</p>

          <Card className="mt-6 p-6">
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Aarav Sharma" className="mt-1.5" required />
              </div>
              <div>
                <Label htmlFor="email">College email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@campus.edu" className="mt-1.5" required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1.5" required />
              </div>
              <div>
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as Role })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Student", "Faculty", "Placement Officer", "Club Coordinator", "Admin"].map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full shadow-elegant" disabled={loading}>
                {loading ? "Creating account…" : "Create account"}
              </Button>
            </form>
          </Card>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
