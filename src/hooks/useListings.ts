import { useQuery } from "@tanstack/react-query"
import { listingsService } from "../api/listings.service"
import type { Listing } from "../types/listing"

export default function useListings(limit = 100) {
  const query = useQuery<Listing[], Error>({
    queryKey: ["listings", { limit }],
    queryFn: () => listingsService.list({ limit })
  })

  return query
}
