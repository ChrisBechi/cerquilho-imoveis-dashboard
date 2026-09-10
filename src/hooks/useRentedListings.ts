import { useQuery } from "@tanstack/react-query"
import { listingsService } from "../api/listings.service"

export default function useRentedListings(limit = 200) {
  return useQuery({
    queryKey: ["rentedListings", { limit }],
    queryFn: () => listingsService.listRented({ limit })
  })
}
