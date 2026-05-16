import { useQuery } from "@tanstack/react-query"
import { listingsService } from "../api/listings.service"
import type { ITimelineEvent } from "../types/listing"

export type ListingDetails = {
  price_history: Array<{ date: string; price: number }>
  timeline: ITimelineEvent[]
}

export default function useListingDetails(listingId: number | null) {
  return useQuery<ListingDetails, Error>({
    queryKey: ["listing", listingId],
    enabled: !!listingId,
    queryFn: async (): Promise<ListingDetails> => {
      if (!listingId) return { price_history: [], timeline: [] }

      const [price_history, events] = await Promise.all([
        listingsService.getPriceHistory(listingId),
        listingsService.getEvents(listingId)
      ])

      const timeline = events.map((e: any) => ({
        type: e.type,
        title: e.title || e.type,
        description: e.description || "",
        date: e.created_at || ""
      }))

      return { price_history, timeline }
    }
  })
}
