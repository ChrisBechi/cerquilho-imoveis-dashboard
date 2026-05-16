import { createContext, type ReactNode, useContext, useMemo } from "react"

import { useFavoritesQuery } from "../hooks/useFavorites"
import type { Listing } from "../types/listing"

interface FavoritesContextData {
  favorites: string[]
  favoriteListings: Listing[]
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  isLoading: boolean
  error: Error | null
}

const FavoritesContext = createContext({} as FavoritesContextData)

interface ProviderProps {
  children: ReactNode
}

export function FavoritesProvider({ children }: ProviderProps) {
  const {
    favorites,
    favoriteListings,
    isFavorite,
    toggleFavorite,
    isLoading,
    error
  } = useFavoritesQuery()

  const value = useMemo(
    () => ({
      favorites,
      favoriteListings,
      isFavorite,
      toggleFavorite,
      isLoading,
      error
    }),
    [favorites, favoriteListings, isFavorite, toggleFavorite, isLoading, error]
  )

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  return useContext(FavoritesContext)
}
