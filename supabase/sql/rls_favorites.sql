-- RLS: allow public favorite operations for development/testing
-- WARNING: This makes favorites writable by any client with the anon key.
-- For production, tighten these rules and add an auth/user_id relationship.

ALTER TABLE IF EXISTS public.favorites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS allow_select_public_favorites ON public.favorites;
CREATE POLICY allow_select_public_favorites ON public.favorites
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS allow_insert_public_favorites ON public.favorites;
CREATE POLICY allow_insert_public_favorites ON public.favorites
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS allow_delete_public_favorites ON public.favorites;
CREATE POLICY allow_delete_public_favorites ON public.favorites
  FOR DELETE
  USING (true);

DROP POLICY IF EXISTS allow_update_public_favorites ON public.favorites;
CREATE POLICY allow_update_public_favorites ON public.favorites
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
