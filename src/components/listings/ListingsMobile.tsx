import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Stack,
  Text
} from "@chakra-ui/react"
import { memo } from "react"
import { FiExternalLink, FiHeart, FiHome, FiMapPin } from "react-icons/fi"
import { TbRulerMeasure } from "react-icons/tb"
import { FaBath, FaHeart } from "react-icons/fa"
import type { Listing } from "../../types/listing"
import ListingsEmptyState from "./ListingsEmptyState"
import { useFavorites } from "../../context/FavoritesContext"

interface Props {
  listings: Listing[]
  onSelect: (listing: Listing) => void
  onReset: () => void
}

function ListingsMobile({ listings, onSelect, onReset }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites()

  if (listings.length === 0) {
    return (
      <ListingsEmptyState
        title="Nenhum imóvel encontrado"
        description="Tente alterar os filtros, remover termos da busca ou redefinir os filtros aplicados."
        buttonLabel="Limpar filtros"
        onButtonClick={onReset}
      />
    )
  }

  return (
    <Stack spacing={4}>
      {listings.map((listing) => (
        <Box
          key={listing.id}
          bg="surfaceSecondary"
          borderRadius="xl"
          border="1px solid"
          borderColor="border"
          overflow="hidden"
          cursor="pointer"
          transition="0.2s"
          _hover={{ transform: "translateY(-2px)", boxShadow: "soft" }}
          onClick={() => onSelect(listing)}
        >
          <Box position="relative">
            <Image
              loading="lazy"
              src={listing.thumbnail_url}
              objectFit="cover"
              h="220px"
              w="100%"
            />
            <Flex
              position="absolute"
              inset={0}
              bgGradient="linear(to-t, rgba(0,0,0,0.75), transparent)"
            />

            <Flex
              position="absolute"
              inset={0}
              justify="space-between"
              align="start"
              top={4}
              left={4}
            >
              {/* <HStack spacing={2} flexWrap="wrap">
                <ListingStatusBadges listing={listing} />
              </HStack> */}

              <IconButton
                onClick={(event) => {
                  event.stopPropagation()
                  toggleFavorite(listing.id.toString())
                }}
                aria-label="Favoritar"
                icon={
                  isFavorite(listing.id.toString()) ? <FaHeart /> : <FiHeart />
                }
                color="danger"
                size="sm"
                borderRadius="full"
                position="absolute"
                right={3}
                top={-1}
                bg="blackAlpha.600"
                _hover={{ transform: "scale(1.08)", bg: "glassHover" }}
              />
            </Flex>

            <Box
              position="absolute"
              bottom={3}
              right={2}
              bg="blackAlpha.600"
              px={4}
              py={2}
              borderRadius="xl"
            >
              <Text color="white" fontWeight="bold" fontSize="xl">
                {listing.price}
              </Text>
            </Box>
          </Box>

          <Stack p={5} spacing={4}>
            <Flex justify="space-between" align="start" gap={4}>
              <Box>
                <Text fontWeight="bold" fontSize="lg" mb={1}>
                  {listing.title}
                </Text>

                {listing.neighborhood && (
                  <HStack color="gray.400" spacing={2} fontSize="sm">
                    <Icon as={FiMapPin} />
                    <Text>{listing.neighborhood}</Text>
                  </HStack>
                )}

                <Text color="gray.500" fontSize="sm">
                  {listing.provider}
                </Text>
              </Box>
            </Flex>

            <HStack spacing={5} color="gray.300">
              <HStack>
                <Icon as={FiHome} />
                <Text>{listing.bedrooms}</Text>
              </HStack>

              <HStack>
                <Icon as={FaBath} />
                <Text>{listing.bathrooms}</Text>
              </HStack>

              <HStack>
                <Icon as={TbRulerMeasure} />
                <Text>
                  {listing.area}
                  m²
                </Text>
              </HStack>
            </HStack>

            {!listing.is_rented && (
              <Button
                w="100%"
                size="lg"
                colorScheme="blue"
                borderRadius="xl"
                variant="solid"
                rightIcon={<FiExternalLink />}
                transition="0.2s"
                mt={5}
                _hover={{ transform: "translateY(-2px)" }}
              >
                Ver imóvel
              </Button>
            )}
          </Stack>
        </Box>
      ))}
    </Stack>
  )
}

export default memo(ListingsMobile)
