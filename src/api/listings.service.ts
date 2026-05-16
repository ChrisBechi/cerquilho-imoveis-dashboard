import { supabase } from "../lib/supabase"
import type { Listing } from "../types/listing"
import { normalizeListing } from "../utils/listingNormalizers"

export const listingsService = {
  async list({ limit = 100 } = {}) {
    const listingResponse = await supabase
      .from("listings")
      .select(
        "id, title, provider, neighborhood, bedrooms, bathrooms, area, thumbnail_url, current_price, price_label, rented_at, url"
      )
      .order("created_at", { ascending: false })
      .limit(limit)

    if (listingResponse.error) throw listingResponse.error

    const listings = listingResponse.data ?? []
    const listingIds = listings.map((listing: any) => listing.id)

    if (!listingIds.length) {
      return [] as Listing[]
    }

    const [imagesResponse, eventsResponse, historyResponse] = await Promise.all([
      supabase
        .from("listing_images")
        .select("listing_id, image_url, created_at")
        .in("listing_id", listingIds),
      supabase
        .from("listing_events")
        .select("listing_id, type, created_at")
        .in("listing_id", listingIds)
        .order("created_at", { ascending: false }),
      supabase
        .from("listing_price_history")
        .select("listing_id, price, created_at")
        .in("listing_id", listingIds)
        .order("created_at", { ascending: false })
    ])

    if (imagesResponse.error) throw imagesResponse.error
    if (eventsResponse.error) throw eventsResponse.error
    if (historyResponse.error) throw historyResponse.error

    const imagesByListing = new Map<number, any[]>()
    const eventsByListing = new Map<number, any[]>()
    const historyByListing = new Map<number, any[]>()

    ;(imagesResponse.data ?? []).forEach((image: any) => {
      const current = imagesByListing.get(image.listing_id) ?? []
      current.push(image)
      imagesByListing.set(image.listing_id, current)
    })

    ;(eventsResponse.data ?? []).forEach((event: any) => {
      const current = eventsByListing.get(event.listing_id) ?? []
      current.push(event)
      eventsByListing.set(event.listing_id, current)
    })

    ;(historyResponse.data ?? []).forEach((historyItem: any) => {
      const current = historyByListing.get(historyItem.listing_id) ?? []
      current.push({ listing_id: historyItem.listing_id, price: historyItem.price, date: historyItem.created_at })
      historyByListing.set(historyItem.listing_id, current)
    })

    return listings.map((row: any) =>
      normalizeListing(
        row,
        imagesByListing.get(row.id) ?? [],
        eventsByListing.get(row.id) ?? [],
        historyByListing.get(row.id) ?? []
      )
    )
  },

  async getPriceHistory(listingId: number) {
    const res = await supabase
      .from("listing_price_history")
      .select("price, created_at")
      .eq("listing_id", listingId)
      .order("created_at", { ascending: true })

    if (res.error) throw res.error

    // normalize to { date, price }
    return (res.data ?? []).map((r: any) => ({ date: r.created_at, price: r.price })) as any[]
  },

  async getEvents(listingId: number) {
    const res = await supabase
      .from("listing_events")
      .select("type, title, description, created_at")
      .eq("listing_id", listingId)
      .order("created_at", { ascending: false })

    if (res.error) throw res.error

    return (res.data ?? []) as any[]
  }
}
