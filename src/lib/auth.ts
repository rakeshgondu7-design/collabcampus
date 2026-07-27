// Real Supabase-backed auth. Keeps the same exported API used across the app
// (useAuth, signIn, signOut, AuthUser, Role) so existing pages keep working.
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type Role = "Student" | "Faculty" | "Placement Officer" | "Club Coordinator" | "Admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

function avatarFor(name: string, email: string) {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name || email)}`;
}

async function hydrateUser(session: Session | null): Promise<AuthUser | null> {
  if (!session?.user) return null;
  const u = session.user;
  const { data: profile } = await supabase
    .from("profiles")
    .select("name, avatar_url")
    .eq("id", u.id)
    .maybeSingle();
  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", u.id);

  const name = profile?.name || (u.user_metadata as any)?.name || u.email?.split("@")[0] || "User";
  const role = (roles?.[0]?.role as Role) || "Student";
  return {
    id: u.id,
    email: u.email ?? "",
    name,
    role,
    avatar: profile?.avatar_url || avatarFor(name, u.email ?? ""),
  };
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Register listener first, then load initial session.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer async work so we don't block the callback.
      setTimeout(async () => {
        const u = await hydrateUser(session);
        if (mounted) {
          setUser(u);
          setHydrated(true);
        }
      }, 0);
    });

    supabase.auth.getSession().then(async ({ data }) => {
      const u = await hydrateUser(data.session);
      if (mounted) {
        setUser(u);
        setHydrated(true);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return hydrateUser(data.session);
  };

  const signUp = async (email: string, password: string, name: string, role: Role = "Student") => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/app`,
        data: { name, role },
      },
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, hydrated, signIn, signUp, signOut };
}

// Backward-compat helpers (no longer used but kept to avoid breakage).
export function getStoredUser(): AuthUser | null { return null; }
