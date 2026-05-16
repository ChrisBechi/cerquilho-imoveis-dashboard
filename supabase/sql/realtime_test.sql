-- Realtime test snippets for notifications
-- Test 1: New listing event (created)
-- insert into listing_events (listing_id, type, title) values (1, 'created', 'Novo imóvel');

-- Test 2: Price drop
-- insert into listing_events (listing_id, type, title, old_price, new_price) values (1, 'price_drop', 'Preço reduzido', 350000, 320000);

-- Test 3: Listing rented
-- update listings set rented_at = now() where id = 1;

-- Test 4: Favorite added (will trigger favorite_added event)
-- insert into favorites (listing_id) values (1);

-- Test 5: Favorite removed
-- delete from favorites where listing_id = 1;

-- Notes: Run these in Supabase SQL editor as an authenticated user. The frontend should pick up realtime events and show toasts and notification center updates.
