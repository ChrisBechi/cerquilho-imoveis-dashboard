-- View: vw_active_count_by_provider
CREATE OR REPLACE VIEW public.vw_active_count_by_provider AS
SELECT
  provider,
  COUNT(*)::bigint AS count
FROM public.listings
WHERE rented_at IS NULL
GROUP BY provider;
