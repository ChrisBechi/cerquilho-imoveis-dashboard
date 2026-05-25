import React, { createContext, useContext, useState } from "react"
import type { Listing } from "../types/listing"

interface ListingDrawerContextData {
  selectedListing: Listing | null
  setSelectedListing: (listing: Listing | null) => void
  openDrawer: (listing: Listing) => void
  closeDrawer: () => void
}

const ListingDrawerContext = createContext({} as ListingDrawerContextData)

export function ListingDrawerProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)

  const openDrawer = (listing: Listing) => {
    setSelectedListing(listing)
  }

  const closeDrawer = () => {
    setSelectedListing(null)
  }

  return (
    <ListingDrawerContext.Provider
      value={{
        selectedListing,
        setSelectedListing,
        openDrawer,
        closeDrawer
      }}
    >
      {children}
    </ListingDrawerContext.Provider>
  )
}

export function useListingDrawer() {
  const context = useContext(ListingDrawerContext)
  if (!context) {
    throw new Error(
      "useListingDrawer must be used within ListingDrawerProvider"
    )
  }
  return context
}
