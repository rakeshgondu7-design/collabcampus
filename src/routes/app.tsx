import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

// SSR disabled: session lives in localStorage (Supabase) and cannot be read server-side.
// The AppShell handles the client-side auth redirect.
export const Route = createFileRoute("/app")({
  ssr: false,
  component: AppShell,
});
