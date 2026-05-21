import { useQuery } from "@tanstack/react-query"
import { dashboardService } from "../api/dashboard.service"
import type { DashboardSummaryDTO } from "../api/dashboard.service"
import { centsToBRL } from "../utils/formatters"

export type DashboardStats = {
  totalActive: number
  newListings: number
  averagePrice: string
  reducedPrices: number
  increasedPrices: number
  rentedCount: number
}

export default function useDashboardStats() {
  return useQuery<DashboardStats, Error>({
    queryKey: ["dashboard", "summary"],
    queryFn: async (): Promise<DashboardStats> => {
      const data: DashboardSummaryDTO = await dashboardService.getSummary({
        lastDays: 7
      })

      return {
        totalActive: data.totalActive,
        newListings: data.newListings,
        averagePrice: centsToBRL(data.averagePrice),
        reducedPrices: data.reducedPrices,
        increasedPrices: data.increasedPrices,
        rentedCount: data.rentedCount
      }
    }
  })
}
