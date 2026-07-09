import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 font-bold text-lg ${className}`}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-hero shadow-glow">
        <GraduationCap className="h-5 w-5 text-white" />
      </span>
      <span className="tracking-tight">Campus<span className="text-primary">Connect</span></span>
    </Link>
  );
}
