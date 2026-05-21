import {
  Box,
  Button,
  Heading,
  HStack,
  Text,
  SimpleGrid,
  Skeleton,
  useToast
} from "@chakra-ui/react"

import { useMemo, useState } from "react"

import ListingsEmptyState from "../components/listings/ListingsEmptyState"
import ListingsGrid from "../components/listings/ListingsGrid"

import useListings from "../hooks/useListings"
import { useFavorites } from "../context/FavoritesContext"

type TabType = "favorites" | "cheap" | "expensive" | "new"

export default function ExploreListingsSection() {
  const [activeTab, setActiveTab] = useState<TabType>("new")
  const { isFavorite, favorites, favoriteListings, toggleFavorite } =
    useFavorites()

  const { data: listings = [], isLoading, error, refetch } = useListings(50)
  const toast = useToast()

  if (error) {
    toast({
      title: "Erro ao carregar imóveis",
      status: "error",
      duration: 5000,
      isClosable: true
    })
  }

  const filteredListings = useMemo(() => {
    const baseListings = listings.filter(
      (listing: any) => !listing.is_reduced && !listing.is_rented
    )

    switch (activeTab) {
      case "cheap":
        return [...baseListings].sort(
          (a: any, b: any) => a.price_numeric - b.price_numeric
        )

      case "expensive":
        return [...baseListings].sort(
          (a: any, b: any) => b.price_numeric - a.price_numeric
        )

      case "new":
        return baseListings.filter((listing: any) => listing.is_new)

      case "favorites":
        return favoriteListings.filter((listing: any) => !listing.is_rented)

      default:
        return baseListings
    }
  }, [activeTab, favoriteListings, isFavorite, listings])

  const limitedListings = useMemo(
    () => filteredListings.slice(0, 8),
    [filteredListings]
  )

  if (!listings.length) {
    return null
  }

  return (
    <Box>
      <HStack
        justify="space-between"
        align="end"
        mb={6}
        flexWrap="wrap"
        gap={4}
      >
        <Box>
          <Heading size="lg" mb={1}>
            Explorar imóveis
          </Heading>

          <Text color="gray.400">
            Navegue pelos imóveis disponíveis no sistema
          </Text>
        </Box>

        <HStack spacing={3} flexWrap="wrap">
          <TabButton
            label="Novos"
            active={activeTab === "new"}
            onClick={() => setActiveTab("new")}
          />
          {favorites.length > 0 && (
            <TabButton
              label="Favoritos"
              active={activeTab === "favorites"}
              onClick={() => setActiveTab("favorites")}
            />
          )}

          <TabButton
            label="Mais baratos"
            active={activeTab === "cheap"}
            onClick={() => setActiveTab("cheap")}
          />

          <TabButton
            label="Mais caros"
            active={activeTab === "expensive"}
            onClick={() => setActiveTab("expensive")}
          />
        </HStack>
      </HStack>

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
      ) : error ? (
        <Box
          bg="surfaceSecondary"
          borderRadius="2xl"
          p={8}
          border="1px solid"
          borderColor="border"
        >
          <Heading size="md" mb={2}>
            Erro ao carregar listagens
          </Heading>
          <Text color="gray.400" mb={4}>
            {String(error)}
          </Text>
          <Button onClick={() => refetch()}>Tentar novamente</Button>
        </Box>
      ) : filteredListings.length === 0 ? (
        <ListingsEmptyState
          title="Nenhum imóvel encontrado"
          description="Tente alterar os filtros, remover termos da busca ou redefinir os filtros aplicados."
        />
      ) : (
        <ListingsGrid
          listings={limitedListings}
          isFavorite={(id) => isFavorite(id)}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </Box>
  )
}

interface TabButtonProps {
  label: string

  active: boolean

  onClick: () => void
}

function TabButton({ label, active, onClick }: TabButtonProps) {
  return (
    <Button
      size="sm"
      borderRadius="full"
      px={5}
      bg={active ? "brand.500" : "whiteAlpha.100"}
      color="white"
      _hover={{
        bg: active ? "brand.400" : "whiteAlpha.200"
      }}
      onClick={onClick}
    >
      {label}
    </Button>
  )
}
