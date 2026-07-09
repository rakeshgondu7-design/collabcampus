import { Link } from "@tanstack/react-router";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export function MarketingNav() {
  const { user, hydrated } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</a>
          <a href="#modules" className="text-sm text-muted-foreground hover:text-foreground">Modules</a>
          <a href="#workflow" className="text-sm text-muted-foreground hover:text-foreground">How it works</a>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          {hydrated && user ? (
            <Button asChild size="sm"><Link to="/app">Go to app</Link></Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/login">Sign in</Link></Button>
              <Button asChild size="sm" className="shadow-elegant"><Link to="/register">Get started</Link></Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 md:grid-cols-5">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            One platform for the complete campus experience — collaborate, learn, and grow with your peers.
          </p>
        </div>
        {[
          { title: "Product", links: ["Features", "Modules", "Pricing", "Changelog"] },
          { title: "Company", links: ["About", "Careers", "Blog", "Contact"] },
          { title: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] },
        ].map((col) => (
          <div key={col.title}>
            <div className="text-sm font-semibold">{col.title}</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {col.links.map((l) => <li key={l}><a href="#" className="hover:text-foreground">{l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground md:flex-row">
          <div>© 2026 Campus Connect. All rights reserved.</div>
          <div>Built for students, by students.</div>
        </div>
      </div>
    </footer>
  );
}
