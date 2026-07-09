import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users, FolderKanban, Briefcase, Lightbulb, CalendarDays, Megaphone, Search,
  Bell, ShieldCheck, Sparkles, ArrowRight, CheckCircle2, GraduationCap, Rocket, Zap,
} from "lucide-react";
import { MarketingNav, MarketingFooter } from "@/components/marketing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  component: Landing,
});

const features = [
  { icon: Users, title: "Team Finder", desc: "Post projects, discover teammates by skill, manage applications end-to-end." },
  { icon: FolderKanban, title: "Resource Hub", desc: "Notes, PPTs, lab code, previous papers — searchable, rated, bookmarked." },
  { icon: Briefcase, title: "Placement Hub", desc: "Company drives, prep resources, interview questions, application tracker." },
  { icon: Lightbulb, title: "Innovation Hub", desc: "Share ideas publicly or anonymously. Get feedback from peers and faculty." },
  { icon: CalendarDays, title: "Events", desc: "Discover, register, and get reminders for every campus event." },
  { icon: Megaphone, title: "Unified Notices", desc: "College, department, placement, exam, and club notices in one feed." },
  { icon: Search, title: "Lost & Found", desc: "Report and reunite with lost items — with admin verification." },
  { icon: Bell, title: "Smart Notifications", desc: "Real-time alerts for teams, placements, events, and matches." },
];

const modules = [
  "Dashboard", "Student Profile", "Notice Board", "Academic Updates",
  "Attendance", "Team Finder", "Resource Hub", "Placement Hub",
  "Event Management", "Lost & Found", "Innovation Hub", "Notifications",
  "Admin Console", "Role-based Access", "Analytics",
];

const stats = [
  { value: "15+", label: "Integrated modules" },
  { value: "5", label: "User roles" },
  { value: "100%", label: "Responsive" },
  { value: "24/7", label: "Access" },
];

const workflow = [
  { step: "01", title: "Join with your college email", desc: "Verify your identity and pick your role — student, faculty, coordinator, or admin." },
  { step: "02", title: "Personalize your workspace", desc: "Add your skills, projects, and preferences so we surface what matters to you." },
  { step: "03", title: "Collaborate & grow", desc: "Find teammates, share resources, prep for placements, and ship together." },
];

const testimonials = [
  { name: "Priya Nair", role: "CSE, 4th year", quote: "Found my hackathon team in 20 minutes. We ended up winning HackCampus." },
  { name: "Dr. Kamath", role: "Faculty, ECE", quote: "Posting notices and tracking events is finally frictionless. My students actually see them now." },
  { name: "Rahul M.", role: "Placement Officer", quote: "Our drive registrations and shortlists happen in one place. Zero spreadsheet chaos." },
];

const faqs = [
  { q: "Is Campus Connect free for students?", a: "Yes — the entire platform is free for verified students of participating institutions." },
  { q: "Can I post ideas anonymously?", a: "Absolutely. In the Innovation Hub you can toggle anonymous mode; only admins can see actual identity, and only for moderation." },
  { q: "How does Team Finder work?", a: "Post a project with required skills, deadlines and slots. Students apply, you accept or reject, and manage your team from your dashboard." },
  { q: "Is my data secure?", a: "All authentication is JWT-based with role-scoped access. Files are stored on secure cloud storage with per-object permissions." },
  { q: "Can faculty and admins use it too?", a: "Yes. Faculty, placement officers, club coordinators, and admins each get tailored dashboards and permissions." },
];

function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-subtle">
        <div className="pointer-events-none absolute inset-0 -z-0">
          <div className="absolute -top-24 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-16 md:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-5 gap-1.5 rounded-full px-3 py-1 text-xs">
              <Sparkles className="h-3.5 w-3.5" /> Now with Team Finder and Innovation Hub
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              One platform.<br />
              <span className="text-gradient">Complete campus experience.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Campus Connect helps students collaborate on projects, share knowledge, prepare for placements,
              and communicate with administration — all in one modern workspace.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="shadow-glow">
                <Link to="/register">Get started free <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login">Sign in</Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              {["No credit card", "Role-based access", "Cloud file storage", "Free for students"].map((f) => (
                <span key={f} className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> {f}</span>
              ))}
            </div>
          </div>

          {/* Hero mockup */}
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="rounded-2xl border border-border bg-card p-2 shadow-glow">
              <div className="rounded-xl bg-gradient-subtle p-6 md:p-10">
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { icon: Users, label: "Active teams", value: "48" },
                    { icon: FolderKanban, label: "Resources shared", value: "1.2K" },
                    { icon: Briefcase, label: "Open drives", value: "12" },
                  ].map((s) => {
                    const I = s.icon;
                    return (
                      <div key={s.label} className="rounded-xl border border-border bg-card p-5">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><I className="h-5 w-5" /></div>
                          <div>
                            <div className="text-2xl font-bold">{s.value}</div>
                            <div className="text-xs text-muted-foreground">{s.label}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold text-primary">Features</div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Everything your campus needs</h2>
          <p className="mt-3 text-muted-foreground">Purpose-built modules that replace a dozen disconnected tools.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const I = f.icon;
            return (
              <Card key={f.title} className="p-6 transition hover:shadow-elegant">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><I className="h-5 w-5" /></div>
                <div className="mt-4 font-semibold">{f.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{f.desc}</div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-sm font-semibold text-primary">Modules</div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">15+ modules, one login</h2>
            <p className="mt-3 text-muted-foreground">A cohesive workspace across every part of student life.</p>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-2">
            {modules.map((m) => (
              <span key={m} className="rounded-full border border-border bg-card px-4 py-2 text-sm shadow-elegant">
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="text-4xl font-bold text-gradient">{s.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold text-primary">How it works</div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Get productive in minutes</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {workflow.map((w) => (
            <Card key={w.step} className="relative p-6">
              <div className="text-5xl font-bold text-primary/15">{w.step}</div>
              <div className="mt-2 text-lg font-semibold">{w.title}</div>
              <div className="mt-2 text-sm text-muted-foreground">{w.desc}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-sm font-semibold text-primary">Loved on campus</div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">What students and faculty say</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="p-6">
                <p className="text-sm leading-relaxed">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-hero text-sm font-semibold text-white">
                    {t.name.split(" ").map((s) => s[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
        <div className="text-center">
          <div className="text-sm font-semibold text-primary">FAQ</div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Questions, answered</h2>
        </div>
        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`i-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="overflow-hidden rounded-3xl bg-gradient-hero p-10 text-center text-white shadow-glow md:p-16">
          <div className="mx-auto flex max-w-2xl flex-col items-center">
            <div className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
              <Rocket className="h-3.5 w-3.5" /> Launch your campus workspace
            </div>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Ready to transform campus life?</h2>
            <p className="mt-3 text-white/85">Join thousands of students already collaborating on Campus Connect.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" variant="secondary" className="text-primary">
                <Link to="/register">Create free account</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10">
                <Link to="/login">Sign in</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
