-- Function: dashboard_summary(last_days integer)
CREATE OR REPLACE FUNCTION public.dashboard_summary(last_days integer DEFAULT 7)
RETURNS TABLE(
  total_active bigint,
  new_listings bigint,
  average_price bigint,
  reduced_prices bigint,
  increased_prices bigint
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    (SELECT COUNT(*) FROM public.listings WHERE rented_at IS NULL) AS total_active,
    (SELECT COUNT(*) FROM public.listing_events WHERE type = 'created' AND created_at >= now() - (last_days || ' days')::interval) AS new_listings,
    (SELECT COALESCE(ROUND(AVG(current_price))::bigint, 0) FROM public.listings WHERE rented_at IS NULL) AS average_price,
    (SELECT COUNT(*) FROM public.listing_events WHERE type = 'price_drop' AND created_at >= now() - (last_days || ' days')::interval) AS reduced_prices,
    (SELECT COUNT(*) FROM public.listing_events WHERE type = 'price_up' AND created_at >= now() - (last_days || ' days')::interval) AS increased_prices;
$$;
