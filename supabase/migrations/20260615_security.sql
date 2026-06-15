-- ============================================================
-- SCARNIKO · SECURITY MIGRATION
-- 1. Row Level Security on user_data
-- 2. Sign-up restriction to allowed emails
-- ============================================================

-- ── 1. RLS on user_data ─────────────────────────────────────

ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own data"   ON public.user_data;
DROP POLICY IF EXISTS "Users can insert own data"  ON public.user_data;
DROP POLICY IF EXISTS "Users can update own data"  ON public.user_data;
DROP POLICY IF EXISTS "Users can delete own data"  ON public.user_data;

CREATE POLICY "Users can read own data"
  ON public.user_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data"
  ON public.user_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
  ON public.user_data FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own data"
  ON public.user_data FOR DELETE
  USING (auth.uid() = user_id);

-- ── 2. Restrict sign-ups to allowed emails ───────────────────

CREATE OR REPLACE FUNCTION auth.restrict_signups()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NEW.email NOT IN ('arnau.sala8@gmail.com') THEN
    RAISE EXCEPTION 'Registro no disponible en esta aplicación.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_signup_restrict ON auth.users;
CREATE TRIGGER on_signup_restrict
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION auth.restrict_signups();
