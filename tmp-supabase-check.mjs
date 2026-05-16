import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
const env = Object.fromEntries(
  fs
    .readFileSync('.env', 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => line.split('='))
)
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)
const show = async (name, p) => {
  const res = await p
  console.log('---', name)
  if (res.error) {
    console.error(res.error)
  } else {
    console.log('count:', res.count)
    console.log(JSON.stringify(res.data, null, 2))
  }
}

await show('listings count', supabase.from('listings').select('id', { count: 'exact', head: true }))
await show('active count', supabase.from('listings').select('id', { count: 'exact', head: true }).is('rented_at', null))
await show('events types', supabase.from('listing_events').select('type', { count: 'exact', head: false }).limit(50))
await show('latest created event', supabase.from('listing_events').select('listing_id,type,created_at').eq('type','created').order('created_at', { ascending: false }).limit(5))
await show('rpc summary', supabase.rpc('dashboard_summary'))
await show('preview price_history row', supabase.from('listing_price_history').select('*').limit(1))
await show(
  'price_history columns',
  supabase
    .from('information_schema.columns')
    .select('column_name,data_type')
    .eq('table_name', 'listing_price_history')
)
await show('preview listing_images row', supabase.from('listing_images').select('*').limit(5))
