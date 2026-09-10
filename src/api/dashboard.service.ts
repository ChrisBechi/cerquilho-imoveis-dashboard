import { supabase } from "../lib/supabase"

export interface DashboardSummaryDTO {
  totalActive: number
  newListings: number
  averagePrice: number // in cents
  reducedPrices: number
  increasedPrices: number
  rentedCount: number
}

const PAGE_SIZE = 1000

async function fetchAllRows(
  createQuery: (from: number, to: number) => any
): Promise<any[]> {
  const rows: any[] = []

  for (let from = 0; ; from += PAGE_SIZE) {
    const response = await createQuery(from, from + PAGE_SIZE - 1)
    if (response.error) throw new Error(response.error.message)

    const page = response.data ?? []
    rows.push(...page)
    if (page.length < PAGE_SIZE) break
  }

  return rows
}

export const dashboardService = {
  async getSummary({ lastDays = 7 } = {}) {
    const createdSince = new Date(
      Date.now() - lastDays * 24 * 60 * 60 * 1000
    ).toISOString()

    const [
      activeCountResponse,
      newCountResponse,
      rentedCountResponse,
      activeListings,
      events
    ] = await Promise.all([
      supabase
        .from("listings")
        .select("id", { count: "exact", head: true })
        .is("rented_at", null),
      supabase
        .from("listing_events")
        .select("id", { count: "exact", head: true })
        .eq("type", "created")
        .gte("created_at", createdSince),
      supabase
        .from("listings")
        .select("id", { count: "exact", head: true })
        .not("rented_at", "is", null),
      fetchAllRows((from, to) =>
        supabase
          .from("listings")
          .select("current_price")
          .is("rented_at", null)
          .range(from, to)
      ),
      fetchAllRows((from, to) =>
        supabase
          .from("listing_events")
          .select("listing_id, type, created_at")
          .order("created_at", { ascending: false })
          .range(from, to)
      )
    ])

    for (const response of [
      activeCountResponse,
      newCountResponse,
      rentedCountResponse
    ]) {
      if (response.error) throw new Error(response.error.message)
    }

    const validPrices = activeListings
      .map((listing) => Number(listing.current_price))
      .filter((price) => Number.isFinite(price) && price > 0)
    const averagePrice = validPrices.length
      ? Math.round(
          validPrices.reduce((total, price) => total + price, 0) /
            validPrices.length
        )
      : 0

    const latestEventByListing = new Map<number, string>()
    for (const event of events) {
      if (!latestEventByListing.has(event.listing_id)) {
        latestEventByListing.set(event.listing_id, event.type)
      }
    }

    const latestEventTypes = Array.from(latestEventByListing.values())

    const summary: DashboardSummaryDTO = {
      totalActive: activeCountResponse.count ?? 0,
      newListings: newCountResponse.count ?? 0,
      averagePrice,
      reducedPrices: latestEventTypes.filter((type) => type === "price_drop").length,
      increasedPrices: latestEventTypes.filter((type) => type === "price_up").length,
      rentedCount: rentedCountResponse.count ?? 0
    }

    return summary
  }
}
