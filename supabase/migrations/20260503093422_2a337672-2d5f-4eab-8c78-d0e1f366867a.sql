
-- Fix search_path on set_updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Restrict EXECUTE on SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Tighten the public insert policy on bookings: require non-empty fields
DROP POLICY IF EXISTS "Anyone can create a booking" ON public.bookings;
CREATE POLICY "Anyone can create a booking" ON public.bookings
FOR INSERT TO anon, authenticated
WITH CHECK (
  length(full_name) BETWEEN 2 AND 120
  AND length(phone) BETWEEN 6 AND 30
  AND length(service) BETWEEN 2 AND 80
  AND scheduled_at > now() - interval '1 day'
);
