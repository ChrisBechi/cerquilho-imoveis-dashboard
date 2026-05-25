import { useCallback } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { favoritesService } from "../services/favorites.service"
import notificationsService from "../services/notifications.service"
import type { Listing } from "../types/listing"

export function useFavoritesQuery() {
  const queryClient = useQueryClient()

  const {
    data: favoriteIds = [],
    isLoading: isFavoriteIdsLoading,
    error: favoriteIdsError
  } = useQuery<string[], Error>({
    queryKey: ["favoriteIds"],
    queryFn: async () => {
      const ids = await favoritesService.getFavoriteIds()
      return ids.map((id) => id.toString())
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false
  })

  const {
    data: favoriteListings = [],
    isLoading: isFavoriteListingsLoading,
    error: favoriteListingsError
  } = useQuery<Listing[], Error>({
    queryKey: ["favorites", favoriteIds],
    queryFn: async () => {
      const numericIds = favoriteIds.map(Number).filter(Boolean)
      return favoritesService.getFavoritesByIds(numericIds)
    },
    enabled: favoriteIds.length > 0,
    staleTime: 1000 * 60,
    keepPreviousData: true,
    refetchOnWindowFocus: false
  })

  type MutationContext = {
    previousFavoriteIds: string[]
  }

  const addFavoriteMutation = useMutation<
    unknown,
    Error,
    number,
    MutationContext
  >({
    mutationFn: (listingId: number) => favoritesService.addFavorite(listingId),
    onMutate: async (listingId) => {
      await queryClient.cancelQueries({ queryKey: ["favoriteIds"] })
      await queryClient.cancelQueries({ queryKey: ["favorites"] })

      const previousFavoriteIds =
        queryClient.getQueryData<string[]>(["favoriteIds"]) ?? []
      const nextFavoriteIds = [...previousFavoriteIds, listingId.toString()]

      const previousFavoriteListings =
        queryClient.getQueryData<Listing[]>([
          "favorites",
          previousFavoriteIds
        ]) ?? []

      queryClient.setQueryData(["favoriteIds"], nextFavoriteIds)
      queryClient.setQueryData(
        ["favorites", nextFavoriteIds],
        previousFavoriteListings
      )

      return {
        previousFavoriteIds
      }
    },
    onError: (_, _listingId, context) => {
      if (context?.previousFavoriteIds) {
        queryClient.setQueryData(["favoriteIds"], context.previousFavoriteIds)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favoriteIds"] })
      queryClient.invalidateQueries({ queryKey: ["favorites"] })
    }
  })

  const removeFavoriteMutation = useMutation<
    unknown,
    Error,
    number,
    MutationContext
  >({
    mutationFn: (listingId: number) =>
      favoritesService.removeFavorite(listingId),
    onMutate: async (listingId) => {
      await queryClient.cancelQueries({ queryKey: ["favoriteIds"] })
      await queryClient.cancelQueries({ queryKey: ["favorites"] })

      const previousFavoriteIds =
        queryClient.getQueryData<string[]>(["favoriteIds"]) ?? []
      const nextFavoriteIds = previousFavoriteIds.filter(
        (favoriteId) => favoriteId !== listingId.toString()
      )

      const previousFavoriteListings =
        queryClient.getQueryData<Listing[]>([
          "favorites",
          previousFavoriteIds
        ]) ?? []
      const nextFavoriteListings = previousFavoriteListings.filter(
        (listing) => listing.id !== listingId
      )

      queryClient.setQueryData(["favoriteIds"], nextFavoriteIds)
      queryClient.setQueryData(
        ["favorites", nextFavoriteIds],
        nextFavoriteListings
      )

      return {
        previousFavoriteIds
      }
    },
    onError: (_, _listingId, context) => {
      if (context?.previousFavoriteIds) {
        queryClient.setQueryData(["favoriteIds"], context.previousFavoriteIds)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favoriteIds"] })
      queryClient.invalidateQueries({ queryKey: ["favorites"] })
    }
  })

  const isFavorite = useCallback(
    (id: string) => favoriteIds.includes(id),
    [favoriteIds]
  )

  const toggleFavorite = useCallback(
    (id: string) => {
      const listingId = Number(id)
      const isCurrentlyFavorite = favoriteIds.includes(id)

      if (isCurrentlyFavorite) {
        removeFavoriteMutation.mutate(listingId, {
          onSettled: () => {
            notificationsService
              .notifyLocalFavorite(listingId, false)
              .catch(() => {})
          }
        })
        return
      }

      addFavoriteMutation.mutate(listingId, {
        onSettled: () => {
          notificationsService
            .notifyLocalFavorite(listingId, true)
            .catch(() => {})
        }
      })
    },
    [favoriteIds, addFavoriteMutation, removeFavoriteMutation]
  )

  const isLoading = isFavoriteIdsLoading || isFavoriteListingsLoading
  const error = favoriteIdsError ?? favoriteListingsError ?? null

  return {
    favorites: favoriteIds,
    favoriteListings,
    isFavorite,
    toggleFavorite,
    isLoading,
    error
  }
}
