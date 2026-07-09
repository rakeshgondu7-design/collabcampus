import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("aarav.sharma@campus.edu");
  const [password, setPassword] = useState("demopass");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Enter email and password");
    setLoading(true);
    setTimeout(() => {
      signIn(email, password);
      toast.success("Welcome back!");
      navigate({ to: "/app" });
    }, 350);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Logo />
          <h1 className="mt-8 text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to continue to Campus Connect.</p>

          <Card className="mt-6 p-6">
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="email">College email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@campus.edu" required className="mt-1.5" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link>
                </div>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1.5" />
              </div>
              <Button type="submit" className="w-full shadow-elegant" disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </Card>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to Campus Connect? <Link to="/register" className="font-medium text-primary hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-gradient-hero lg:block">
        <div className="absolute inset-0 grid place-items-center p-12">
          <div className="max-w-md text-white">
            <div className="text-sm font-medium uppercase tracking-wider text-white/70">Campus Connect</div>
            <h2 className="mt-3 text-3xl font-bold leading-tight">One platform. Complete campus experience.</h2>
            <p className="mt-4 text-white/85">Collaborate on projects, share resources, ace placements, and stay in the loop — all in one place.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
