-- RLS: allow public read access for development/testing
-- WARNING: This makes table data publicly readable. Restrict policies in production.

-- listings
ALTER TABLE IF EXISTS public.listings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS allow_select_public_listings ON public.listings;
CREATE POLICY allow_select_public_listings ON public.listings
  FOR SELECT
  USING (true);

-- listing_events
ALTER TABLE IF EXISTS public.listing_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS allow_select_public_listing_events ON public.listing_events;
CREATE POLICY allow_select_public_listing_events ON public.listing_events
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS allow_update_public_listing_events ON public.listing_events;
CREATE POLICY allow_update_public_listing_events ON public.listing_events
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS allow_delete_public_listing_events ON public.listing_events;
CREATE POLICY allow_delete_public_listing_events ON public.listing_events
  FOR DELETE
  USING (true);

-- listing_images
ALTER TABLE IF EXISTS public.listing_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS allow_select_public_listing_images ON public.listing_images;
CREATE POLICY allow_select_public_listing_images ON public.listing_images
  FOR SELECT
  USING (true);

-- listing_price_history
ALTER TABLE IF EXISTS public.listing_price_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS allow_select_public_listing_price_history ON public.listing_price_history;
CREATE POLICY allow_select_public_listing_price_history ON public.listing_price_history
  FOR SELECT
  USING (true);

-- Optionally, re-check RPC/function visibility if needed (no action required here).

-- Notes:
-- 1) Execute this SQL in the Supabase SQL editor as an authenticated admin.
-- 2) For production, replace `USING (true)` with stricter conditions, e.g.:
--    USING (auth.role() = 'anon') or use `WITH CHECK` for inserts/updates.
