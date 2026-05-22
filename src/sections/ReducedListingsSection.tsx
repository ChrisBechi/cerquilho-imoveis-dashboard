import { Box, Grid, Heading, HStack, Text } from "@chakra-ui/react"

import { FiTrendingDown } from "react-icons/fi"

import ListingCard from "../components/listings/ListingCard"
import { useFavorites } from "../context/FavoritesContext"
import useReducedListings from "../hooks/useReducedListings"
import { Skeleton } from "@chakra-ui/react"

export default function ReducedListingsSection() {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { data: reducedListings = [], isLoading } = useReducedListings(50)

  const sortedReducedListings = reducedListings
    .filter((listing: any) => listing.is_reduced)
    .sort((a, b) => {
      const dateA = a.price_reduced_at ? new Date(a.price_reduced_at).getTime() : 0
      const dateB = b.price_reduced_at ? new Date(b.price_reduced_at).getTime() : 0
      return dateB - dateA
    })

  if (!sortedReducedListings.length) {
    return null
  }

  return (
    <Box mt={14}>
      <HStack mb={6} spacing={4}>
        <Box p={3} borderRadius="xl" bg="rgba(255,0,0,0.12)" color="red.300">
          <FiTrendingDown />
        </Box>

        <Box>
          <Heading size="lg">Recém reduzidos</Heading>

          <Text color="gray.400">Imóveis com redução recente de preço</Text>
        </Box>
      </HStack>

      <Grid
        templateColumns={{
          base: "1fr",
          md: "1fr 1fr",
          xl: "repeat(4, 1fr)"
        }}
        gap={6}
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} height="220px" borderRadius="2xl" />
            ))
          : sortedReducedListings
              .slice(0, 8)
              .map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isFavorite={isFavorite(listing.id.toString())}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
      </Grid>
    </Box>
  )
}
