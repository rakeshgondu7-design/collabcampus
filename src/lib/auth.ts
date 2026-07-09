// Lightweight mock auth using localStorage. Replace with Lovable Cloud when wiring backend.
import { useEffect, useState } from "react";
import { currentUser } from "./mock-data";

export type Role = "Student" | "Faculty" | "Placement Officer" | "Club Coordinator" | "Admin";
export interface AuthUser {
  id: string; name: string; email: string; role: Role; avatar?: string;
}

const KEY = "cc.auth.user";

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}

export function signIn(email: string, _password: string, role: Role = "Student"): AuthUser {
  const user: AuthUser = {
    id: currentUser.id,
    name: email.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || currentUser.name,
    email,
    role,
    avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(email)}`,
  };
  localStorage.setItem(KEY, JSON.stringify(user));
  return user;
}

export function signOut() {
  localStorage.removeItem(KEY);
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setUser(getStoredUser());
    setHydrated(true);
    const onStorage = () => setUser(getStoredUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return { user, hydrated, signIn: (e: string, p: string, r?: Role) => { const u = signIn(e, p, r); setUser(u); return u; }, signOut: () => { signOut(); setUser(null); } };
}
