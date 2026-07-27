
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('Student', 'Faculty', 'Placement Officer', 'Club Coordinator', 'Admin');
CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'late');
CREATE TYPE public.application_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');
CREATE TYPE public.lost_found_type AS ENUM ('lost', 'found');
CREATE TYPE public.notice_priority AS ENUM ('low', 'normal', 'high', 'urgent');

-- ============ SHARED HELPERS ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  department TEXT,
  year TEXT,
  bio TEXT,
  phone TEXT,
  github TEXT,
  linkedin TEXT,
  portfolio TEXT,
  avatar_url TEXT,
  resume_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_all_auth" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "user_roles_admin_all" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'Admin')) WITH CHECK (public.has_role(auth.uid(), 'Admin'));

-- ============ SIGNUP TRIGGER ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _role app_role;
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email
  ) ON CONFLICT (id) DO NOTHING;

  BEGIN
    _role := COALESCE(NEW.raw_user_meta_data->>'role', 'Student')::app_role;
  EXCEPTION WHEN OTHERS THEN
    _role := 'Student'::app_role;
  END;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ NOTICES ============
CREATE TABLE public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  priority notice_priority NOT NULL DEFAULT 'normal',
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notices TO authenticated;
GRANT ALL ON public.notices TO service_role;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notices_select_auth" ON public.notices FOR SELECT TO authenticated USING (true);
CREATE POLICY "notices_insert_faculty_admin" ON public.notices FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id AND (public.has_role(auth.uid(), 'Faculty') OR public.has_role(auth.uid(), 'Admin') OR public.has_role(auth.uid(), 'Club Coordinator') OR public.has_role(auth.uid(), 'Placement Officer')));
CREATE POLICY "notices_update_own_or_admin" ON public.notices FOR UPDATE TO authenticated
  USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'Admin'));
CREATE POLICY "notices_delete_own_or_admin" ON public.notices FOR DELETE TO authenticated
  USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'Admin'));
CREATE TRIGGER trg_notices_updated BEFORE UPDATE ON public.notices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ NOTIFICATIONS ============
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'info',
  text TEXT NOT NULL,
  link TEXT,
  unread BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif_select_own" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "notif_update_own" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "notif_delete_own" ON public.notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);
-- inserts happen via service role / triggers only

-- ============ IDEAS ============
CREATE TABLE public.ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ideas TO authenticated;
GRANT ALL ON public.ideas TO service_role;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ideas_select_auth" ON public.ideas FOR SELECT TO authenticated USING (true);
CREATE POLICY "ideas_insert_own" ON public.ideas FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "ideas_update_own" ON public.ideas FOR UPDATE TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "ideas_delete_own_or_admin" ON public.ideas FOR DELETE TO authenticated
  USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'Admin'));
CREATE TRIGGER trg_ideas_updated BEFORE UPDATE ON public.ideas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.idea_likes (
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (idea_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.idea_likes TO authenticated;
GRANT ALL ON public.idea_likes TO service_role;
ALTER TABLE public.idea_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "likes_select_auth" ON public.idea_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "likes_insert_own" ON public.idea_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes_delete_own" ON public.idea_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Safe view exposing ideas with anonymous authors masked
CREATE OR REPLACE VIEW public.ideas_public
WITH (security_invoker=on) AS
SELECT
  i.id, i.title, i.description, i.category, i.anonymous, i.created_at,
  CASE WHEN i.anonymous AND NOT public.has_role(auth.uid(), 'Admin') AND i.author_id <> auth.uid()
       THEN NULL ELSE i.author_id END AS author_id,
  CASE WHEN i.anonymous AND NOT public.has_role(auth.uid(), 'Admin') AND i.author_id <> auth.uid()
       THEN 'Anonymous' ELSE p.name END AS author_name,
  (SELECT COUNT(*) FROM public.idea_likes WHERE idea_id = i.id)::int AS likes_count,
  EXISTS (SELECT 1 FROM public.idea_likes WHERE idea_id = i.id AND user_id = auth.uid()) AS liked_by_me
FROM public.ideas i
LEFT JOIN public.profiles p ON p.id = i.author_id;
GRANT SELECT ON public.ideas_public TO authenticated;

-- ============ EVENTS ============
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  category TEXT DEFAULT 'General',
  organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_select_auth" ON public.events FOR SELECT TO authenticated USING (true);
CREATE POLICY "events_insert_auth" ON public.events FOR INSERT TO authenticated WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "events_update_own_or_admin" ON public.events FOR UPDATE TO authenticated
  USING (auth.uid() = organizer_id OR public.has_role(auth.uid(), 'Admin'));
CREATE POLICY "events_delete_own_or_admin" ON public.events FOR DELETE TO authenticated
  USING (auth.uid() = organizer_id OR public.has_role(auth.uid(), 'Admin'));
CREATE TRIGGER trg_events_updated BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.event_registrations (
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (event_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.event_registrations TO authenticated;
GRANT ALL ON public.event_registrations TO service_role;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "regs_select_auth" ON public.event_registrations FOR SELECT TO authenticated USING (true);
CREATE POLICY "regs_insert_own" ON public.event_registrations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "regs_delete_own" ON public.event_registrations FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ SUBJECTS + ATTENDANCE ============
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  department TEXT,
  faculty_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subjects TO authenticated;
GRANT ALL ON public.subjects TO service_role;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subj_select_auth" ON public.subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "subj_insert_faculty_admin" ON public.subjects FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'Faculty') OR public.has_role(auth.uid(), 'Admin'));
CREATE POLICY "subj_update_owner_admin" ON public.subjects FOR UPDATE TO authenticated
  USING (faculty_id = auth.uid() OR public.has_role(auth.uid(), 'Admin'));
CREATE POLICY "subj_delete_owner_admin" ON public.subjects FOR DELETE TO authenticated
  USING (faculty_id = auth.uid() OR public.has_role(auth.uid(), 'Admin'));

CREATE TABLE public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  status attendance_status NOT NULL DEFAULT 'present',
  marked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (subject_id, student_id, session_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance_records TO authenticated;
GRANT ALL ON public.attendance_records TO service_role;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "att_select_own_or_faculty" ON public.attendance_records FOR SELECT TO authenticated
  USING (auth.uid() = student_id OR public.has_role(auth.uid(), 'Faculty') OR public.has_role(auth.uid(), 'Admin'));
CREATE POLICY "att_insert_faculty" ON public.attendance_records FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'Faculty') OR public.has_role(auth.uid(), 'Admin'));
CREATE POLICY "att_update_faculty" ON public.attendance_records FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'Faculty') OR public.has_role(auth.uid(), 'Admin'));
CREATE POLICY "att_delete_faculty" ON public.attendance_records FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'Faculty') OR public.has_role(auth.uid(), 'Admin'));

-- ============ TEAM PROJECTS ============
CREATE TABLE public.team_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  slots_needed INT NOT NULL DEFAULT 1,
  deadline DATE,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_projects TO authenticated;
GRANT ALL ON public.team_projects TO service_role;
ALTER TABLE public.team_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "proj_select_auth" ON public.team_projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "proj_insert_own" ON public.team_projects FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "proj_update_own_or_admin" ON public.team_projects FOR UPDATE TO authenticated
  USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'Admin'));
CREATE POLICY "proj_delete_own_or_admin" ON public.team_projects FOR DELETE TO authenticated
  USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'Admin'));
CREATE TRIGGER trg_proj_updated BEFORE UPDATE ON public.team_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.team_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.team_projects(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT,
  status application_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (project_id, applicant_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_applications TO authenticated;
GRANT ALL ON public.team_applications TO service_role;
ALTER TABLE public.team_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tapp_select_visible" ON public.team_applications FOR SELECT TO authenticated
  USING (auth.uid() = applicant_id OR EXISTS (SELECT 1 FROM public.team_projects tp WHERE tp.id = project_id AND tp.owner_id = auth.uid()) OR public.has_role(auth.uid(), 'Admin'));
CREATE POLICY "tapp_insert_own" ON public.team_applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = applicant_id);
CREATE POLICY "tapp_update_owner_or_applicant" ON public.team_applications FOR UPDATE TO authenticated
  USING (auth.uid() = applicant_id OR EXISTS (SELECT 1 FROM public.team_projects tp WHERE tp.id = project_id AND tp.owner_id = auth.uid()));
CREATE POLICY "tapp_delete_own" ON public.team_applications FOR DELETE TO authenticated USING (auth.uid() = applicant_id);
CREATE TRIGGER trg_tapp_updated BEFORE UPDATE ON public.team_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ RESOURCES ============
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Notes',
  file_path TEXT,
  file_url TEXT,
  downloads INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resources TO authenticated;
GRANT ALL ON public.resources TO service_role;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "res_select_auth" ON public.resources FOR SELECT TO authenticated USING (true);
CREATE POLICY "res_insert_own" ON public.resources FOR INSERT TO authenticated WITH CHECK (auth.uid() = uploader_id);
CREATE POLICY "res_update_own_or_admin" ON public.resources FOR UPDATE TO authenticated
  USING (auth.uid() = uploader_id OR public.has_role(auth.uid(), 'Admin'));
CREATE POLICY "res_delete_own_or_admin" ON public.resources FOR DELETE TO authenticated
  USING (auth.uid() = uploader_id OR public.has_role(auth.uid(), 'Admin'));
CREATE TRIGGER trg_res_updated BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ LOST & FOUND ============
CREATE TABLE public.lost_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type lost_found_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  contact TEXT,
  image_url TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lost_items TO authenticated;
GRANT ALL ON public.lost_items TO service_role;
ALTER TABLE public.lost_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lf_select_auth" ON public.lost_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "lf_insert_own" ON public.lost_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "lf_update_own_or_admin" ON public.lost_items FOR UPDATE TO authenticated
  USING (auth.uid() = reporter_id OR public.has_role(auth.uid(), 'Admin'));
CREATE POLICY "lf_delete_own_or_admin" ON public.lost_items FOR DELETE TO authenticated
  USING (auth.uid() = reporter_id OR public.has_role(auth.uid(), 'Admin'));
CREATE TRIGGER trg_lf_updated BEFORE UPDATE ON public.lost_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ PLACEMENTS ============
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.companies TO authenticated;
GRANT ALL ON public.companies TO service_role;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comp_select_auth" ON public.companies FOR SELECT TO authenticated USING (true);
CREATE POLICY "comp_manage_officer_admin" ON public.companies FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'Placement Officer') OR public.has_role(auth.uid(), 'Admin'))
  WITH CHECK (public.has_role(auth.uid(), 'Placement Officer') OR public.has_role(auth.uid(), 'Admin'));

CREATE TABLE public.placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  ctc TEXT,
  location TEXT,
  eligibility TEXT,
  apply_deadline DATE,
  posted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.placements TO authenticated;
GRANT ALL ON public.placements TO service_role;
ALTER TABLE public.placements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "plc_select_auth" ON public.placements FOR SELECT TO authenticated USING (true);
CREATE POLICY "plc_manage_officer_admin" ON public.placements FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'Placement Officer') OR public.has_role(auth.uid(), 'Admin'))
  WITH CHECK (public.has_role(auth.uid(), 'Placement Officer') OR public.has_role(auth.uid(), 'Admin'));
CREATE TRIGGER trg_plc_updated BEFORE UPDATE ON public.placements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.placement_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  placement_id UUID NOT NULL REFERENCES public.placements(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status application_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (placement_id, student_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.placement_applications TO authenticated;
GRANT ALL ON public.placement_applications TO service_role;
ALTER TABLE public.placement_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "papp_select_visible" ON public.placement_applications FOR SELECT TO authenticated
  USING (auth.uid() = student_id OR public.has_role(auth.uid(), 'Placement Officer') OR public.has_role(auth.uid(), 'Admin'));
CREATE POLICY "papp_insert_own" ON public.placement_applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);
CREATE POLICY "papp_update_officer_or_owner" ON public.placement_applications FOR UPDATE TO authenticated
  USING (auth.uid() = student_id OR public.has_role(auth.uid(), 'Placement Officer') OR public.has_role(auth.uid(), 'Admin'));
CREATE POLICY "papp_delete_own" ON public.placement_applications FOR DELETE TO authenticated USING (auth.uid() = student_id);
CREATE TRIGGER trg_papp_updated BEFORE UPDATE ON public.placement_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ REALTIME ============
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notices;
