import { supabase } from "../lib/supabase"
import { listingsService } from "../api/listings.service"
import type { Listing } from "../types/listing"

export const favoritesService = {
  async getFavoriteIds() {
    const response = await supabase
      .from("favorites")
      .select("listing_id")
      .order("created_at", { ascending: false })

    if (response.error) throw response.error

    return (response.data ?? []).map((row: any) => row.listing_id)
  },

  async getFavorites() {
    const favoriteIds = await this.getFavoriteIds()

    if (!favoriteIds.length) {
      return [] as Listing[]
    }

    return listingsService.listByIds(favoriteIds)
  },

  async getFavoritesByIds(listingIds: number[]) {
    if (!listingIds.length) {
      return [] as Listing[]
    }

    return listingsService.listByIds(listingIds)
  },

  async addFavorite(listingId: number) {
    const existing = await supabase
      .from("favorites")
      .select("id, listing_id")
      .eq("listing_id", listingId)
      .maybeSingle()

    if (existing.error) throw existing.error
    if (existing.data) return existing.data

    const response = await supabase
      .from("favorites")
      .insert({ listing_id: listingId })
      .select("id, listing_id, created_at")
      .maybeSingle()

    if (response.error) throw response.error

    return response.data
  },

  async removeFavorite(listingId: number) {
    const response = await supabase
      .from("favorites")
      .delete()
      .eq("listing_id", listingId)
      .select("id, listing_id")
      .maybeSingle()

    if (response.error) throw response.error

    return response.data
  },

  async isFavorite(listingId: number) {
    const response = await supabase
      .from("favorites")
      .select("id")
      .eq("listing_id", listingId)
      .maybeSingle()

    if (response.error) throw response.error

    return Boolean(response.data)
  }
}
