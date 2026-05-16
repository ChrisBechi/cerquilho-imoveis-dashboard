import { Grid } from "@chakra-ui/react"
import { memo } from "react"
import type { Listing } from "../../types/listing"
import ListingCard from "./ListingCard"

interface Props {
  listings: Listing[]
  isFavorite: (id: string) => boolean
  onToggleFavorite: (id: string) => void
}

function ListingsGrid({ listings, isFavorite, onToggleFavorite }: Props) {
  return (
    <Grid
      templateColumns={{
        base: "1fr",
        md: "1fr 1fr",
        xl: "repeat(3, 1fr)",
        "2xl": "repeat(4, 1fr)"
      }}
      gap={6}
    >
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          isFavorite={isFavorite(listing.id.toString())}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </Grid>
  )
}

export default memo(ListingsGrid)
