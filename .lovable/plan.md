
Lovable Cloud is now enabled. Converting all 15 modules end-to-end in a single turn would produce fragile code and a huge diff, so I'll ship it in three focused phases. Every phase leaves the app fully working — no half-broken screens.

## Phase 1 — Foundation + core auth (this turn)

**Backend (one migration)**
- `profiles` (linked to `auth.users`, cascade delete) — name, email, role, dept, year, bio, phone, github, linkedin, portfolio, avatar_url, resume_url
- `app_role` enum + `user_roles` + security-definer `has_role()` (no roles on profiles — privilege-escalation safe)
- `handle_new_user()` trigger: auto-creates profile and assigns `Student` role on signup
- Core content tables with RLS + GRANTs: `notices`, `notifications`, `ideas`, `idea_likes`, `lost_items`, `events`, `event_registrations`, `resources`, `team_projects`, `team_applications`, `subjects`, `attendance_records`, `companies`, `placements`, `placement_applications`
- RLS: users see their own private data; posts/notices/events/etc are readable by any authenticated user; only owners (or admins via `has_role`) can update/delete

**Frontend rewiring**
- Delete `src/lib/mock-data.ts` usage from auth; replace `src/lib/auth.ts` with a real Supabase-backed `useAuth` (same exported API, so existing pages keep compiling)
- Rewrite `login.tsx`, `register.tsx`, `forgot-password.tsx` + add `reset-password.tsx` — real `supabase.auth` calls, email/password + Google
- Add proper session guard on `/app/*` (client-side `beforeLoad` with `ssr:false` on `src/routes/app.tsx`); redirect unauthenticated → `/login`
- Root `onAuthStateChange` subscriber → `router.invalidate()` on sign-in/out
- Sign-out hygiene in the app shell (cancel queries, clear cache, replace-navigate to `/login`)
- Rewire these modules to real DB (React Query + server calls, real-time where useful):
  - **Profile** — read/update own profile, upload avatar + resume to Storage
  - **Notifications** — read from `notifications` table, mark-as-read, realtime
  - **Notices** — list + create (author from session), delete own; role-based create for Faculty/Admin
  - **Innovation Hub (Ideas)** — list + create + like (anonymous honored via masked author)

Other modules (Attendance marking, Team Finder, Resources, Placements, Events, Lost & Found, Admin) keep their current UI reading from `mock-data.ts` until Phase 2 so nothing breaks visually. Each will show a small "Demo data" badge so it's obvious.

## Phase 2 — Collaboration + academic modules (next turn)
Wire Attendance (Faculty marks → real records, Student view calculates % from DB), Team Finder (projects + applications), Resources (uploads to Storage), Events (create + register). Add Admin dashboard reading real counts + moderation actions gated by `has_role('Admin')`.

## Phase 3 — Placements + polish (final turn)
Placements (companies, applications, status tracking), Lost & Found (with image uploads), Academic Updates, Notice reactions/comments, email notifications via a server function.

## Technical notes

- Storage buckets created in Phase 1: `avatars` (public), `resumes` (private), `resources` (private), `lost-found` (public)
- All server reads for signed-in-user data go through `createServerFn` + `requireSupabaseAuth`; landing page + notice list remain public via anon SELECT policies
- Google sign-in wired via `lovable.auth.signInWithOAuth` (managed OAuth — no keys needed)
- Realtime enabled on `notifications` and `notices` in Phase 1

Confirm and I'll execute Phase 1 immediately.
