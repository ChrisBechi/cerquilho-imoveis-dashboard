import { supabase } from "../lib/supabase"

export interface ProviderCount {
  provider: string
  count: number
}

export interface ProviderAverage {
  provider: string
  average: number // in cents
}

export const analyticsService = {
  async getActiveCountByProvider() {
    const res = await supabase
      .from("vw_active_count_by_provider")
      .select("provider, count")

    if (res.error) throw res.error

    return (res.data ?? []).map((r: any) => ({
      provider: r.provider,
      count: Number(r.count ?? 0)
    }))
  },

  async getAveragePriceByProvider() {
    const res = await supabase
      .from("vw_avg_price_by_provider")
      .select("provider, average")

    if (res.error) throw res.error

    return (res.data ?? []).map((r: any) => ({
      provider: r.provider,
      average: Number(r.average ?? 0)
    }))
  }
}
