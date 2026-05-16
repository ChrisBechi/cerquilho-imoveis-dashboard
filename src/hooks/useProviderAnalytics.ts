import { useQuery } from "@tanstack/react-query"
import { analyticsService } from "../api/analytics.service"
import type { ProviderCount, ProviderAverage } from "../api/analytics.service"
import { centsToBRL } from "../utils/formatters"

export function useProviderCounts() {
  return useQuery<ProviderCount[], Error>({
    queryKey: ["analytics", "providerCounts"],
    queryFn: () => analyticsService.getActiveCountByProvider()
  })
}

export type ProviderAverageWithFormatted = ProviderAverage & { formatted: string }

export function useProviderAverages() {
  return useQuery<ProviderAverageWithFormatted[], Error>({
    queryKey: ["analytics", "providerAverages"],
    queryFn: async () => {
      const data = await analyticsService.getAveragePriceByProvider()

      return data.map((d) => ({ ...d, formatted: centsToBRL(d.average) }))
    }
  })
}
