import { useQuery } from "@tanstack/react-query"
import { listingsService } from "../api/listings.service"
import type { Listing } from "../types/listing"

export default function useReducedListings(limit = 50) {
  return useQuery<Listing[], Error>({
    queryKey: ["reducedListings", { limit }],
    queryFn: () => listingsService.listReduced({ limit })
  })
}
