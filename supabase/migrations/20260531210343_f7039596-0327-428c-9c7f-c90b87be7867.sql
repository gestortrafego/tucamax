
-- Lock down companies inserts to server-side only (no client-side insert flow exists)
DROP POLICY IF EXISTS "Companies: insert authenticated" ON public.companies;

-- Prevent users from self-promoting credits/plan via profile updates
CREATE OR REPLACE FUNCTION public.prevent_profile_privileged_updates()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF current_setting('role', true) <> 'service_role' THEN
    IF NEW.credits_total IS DISTINCT FROM OLD.credits_total
       OR NEW.credits_used  IS DISTINCT FROM OLD.credits_used
       OR NEW.plan_name     IS DISTINCT FROM OLD.plan_name THEN
      RAISE EXCEPTION 'Not allowed to modify billing fields (credits_total, credits_used, plan_name) from client. These are managed server-side.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_prevent_privileged_updates ON public.profiles;
CREATE TRIGGER profiles_prevent_privileged_updates
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_profile_privileged_updates();
