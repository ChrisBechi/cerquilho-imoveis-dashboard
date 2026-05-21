import { supabase } from "../lib/supabase"

export interface DashboardSummaryDTO {
  totalActive: number
  newListings: number
  averagePrice: number // in cents
  reducedPrices: number
  increasedPrices: number
  rentedCount: number
}

export const dashboardService = {
  async getSummary({ lastDays = 7 } = {}) {
    const res = await supabase.rpc("dashboard_summary", { last_days: lastDays })

    if (res.error) {
      throw new Error(res.error.message)
    }

    const row = Array.isArray(res.data) ? res.data[0] : res.data

    const summary: DashboardSummaryDTO = {
      totalActive: Number(row?.total_active ?? 0),
      newListings: Number(row?.new_listings ?? 0),
      averagePrice: Number(row?.average_price ?? 0),
      reducedPrices: Number(row?.reduced_prices ?? 0),
      increasedPrices: Number(row?.increased_prices ?? 0),
      rentedCount: Number(row?.rented_count ?? 0)
    }

    return summary
  }
}
