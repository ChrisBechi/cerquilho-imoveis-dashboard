-- View: vw_avg_price_by_provider
CREATE OR REPLACE VIEW public.vw_avg_price_by_provider AS
SELECT
  provider,
  COALESCE(ROUND(AVG(current_price))::bigint, 0) AS average
FROM public.listings
WHERE rented_at IS NULL
GROUP BY provider
ORDER BY average DESC;
