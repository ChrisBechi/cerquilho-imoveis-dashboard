import { Box, Grid, Heading, HStack, Text } from "@chakra-ui/react"

import { FiCheckCircle } from "react-icons/fi"

import ListingCard from "../components/listings/ListingCard"
import LoadMoreButton from "../components/listings/LoadMoreButton"
import { useFavorites } from "../context/FavoritesContext"
import useListings from "../hooks/useListings"
import { Skeleton } from "@chakra-ui/react"
import { useState } from "react"

const ITEMS_PER_PAGE = 8

export default function RentedListingsSection() {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const { isFavorite, toggleFavorite } = useFavorites()
  const { data: listings = [], isLoading } = useListings(50)
  const rentedListings = listings
    .filter((listing: any) => listing.is_rented)
    .sort((a, b) => {
      const dateA = a.rented_at ? new Date(a.rented_at).getTime() : 0
      const dateB = b.rented_at ? new Date(b.rented_at).getTime() : 0
      return dateB - dateA
    })

  if (!rentedListings.length) {
    return null
  }

  return (
    <Box mt={14}>
      <HStack mb={6} spacing={4}>
        <Box
          p={3}
          borderRadius="xl"
          bg="rgba(120,81,255,0.12)"
          color="purple.300"
        >
          <FiCheckCircle />
        </Box>

        <Box>
          <Heading size="lg">Recém alugados</Heading>

          <Text color="gray.400">
            Imóveis que saíram recentemente do mercado
          </Text>
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
          : rentedListings
              .slice(0, visibleCount)
              .map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isFavorite={isFavorite(listing.id.toString())}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
      </Grid>

      {visibleCount < rentedListings.length && (
        <HStack justify="center" mt={6}>
          <LoadMoreButton
            label="Ver mais"
            onClick={() =>
              setVisibleCount((count) => count + ITEMS_PER_PAGE)
            }
          />
        </HStack>
      )}
    </Box>
  )
}
