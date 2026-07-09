import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPasswordPage });

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    toast.success("Reset link sent — check your inbox.");
  };
  return (
    <div className="grid min-h-screen place-items-center bg-gradient-subtle px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center"><Logo className="justify-center" /></div>
        <Card className="mt-8 p-6">
          <h1 className="text-xl font-bold">Reset your password</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter your college email and we'll send you a reset link.</p>
          {sent ? (
            <div className="mt-6 rounded-lg border border-success/30 bg-success/10 p-4 text-sm text-success-foreground">
              If an account exists for <b>{email}</b>, a reset link has been sent.
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" required />
              </div>
              <Button type="submit" className="w-full">Send reset link</Button>
            </form>
          )}
          <div className="mt-6 text-center text-sm">
            <Link to="/login" className="text-primary hover:underline">← Back to sign in</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
