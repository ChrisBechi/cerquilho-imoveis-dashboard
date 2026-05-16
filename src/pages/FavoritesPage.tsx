import { Box, Heading, SimpleGrid, Skeleton, Text } from "@chakra-ui/react"
import ListingsEmptyState from "../components/listings/ListingsEmptyState"
import ListingsGrid from "../components/listings/ListingsGrid"
import { useFavorites } from "../context/FavoritesContext"

export default function FavoritesPage() {
  const { favoriteListings, isFavorite, toggleFavorite, isLoading } =
    useFavorites()

  return (
    <Box>
      <Box mb={6}>
        <Heading size="lg" mb={2}>
          Favoritos
        </Heading>
        <Text color="gray.400">
          Veja os imóveis marcados como favoritos no seu perfil.
        </Text>
      </Box>

      {isLoading ? (
        <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={6}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <Box key={idx} bg="surfaceSecondary" borderRadius="xl" p={4}>
              <Skeleton height="160px" borderRadius="md" />
              <Skeleton height="20px" mt={4} w="70%" />
              <Skeleton height="16px" mt={2} w="40%" />
            </Box>
          ))}
        </SimpleGrid>
      ) : favoriteListings.length === 0 ? (
        <ListingsEmptyState
          title="Nenhum favorito encontrado"
          description="Marque imóveis como favoritos para encontrá-los aqui mais rápido."
        />
      ) : (
        <ListingsGrid
          listings={favoriteListings}
          isFavorite={(id) => isFavorite(id)}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </Box>
  )
}
