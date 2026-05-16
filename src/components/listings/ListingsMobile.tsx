import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Image,
  Stack,
  Text
} from "@chakra-ui/react"
import { memo } from "react"
import { FiExternalLink, FiHome } from "react-icons/fi"
import { TbRulerMeasure } from "react-icons/tb"
import { FaBath } from "react-icons/fa"
import type { Listing } from "../../types/listing"
import ListingsEmptyState from "./ListingsEmptyState"

interface Props {
  listings: Listing[]
  onSelect: (listing: Listing) => void
  onReset: () => void
}

function ListingsMobile({ listings, onSelect, onReset }: Props) {
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
          <Image
            loading="lazy"
            src={listing.thumbnail_url}
            h="220px"
            w="100%"
            objectFit="cover"
          />

          <Stack p={5} spacing={4}>
            <Flex justify="space-between" align="start" gap={4}>
              <Box>
                <Text fontWeight="bold" fontSize="lg" mb={1}>
                  {listing.title}
                </Text>

                <Text color="gray.400" fontSize="sm">
                  {listing.neighborhood}
                </Text>
              </Box>

              <Text fontWeight="bold" color="blue.300">
                {listing.price}
              </Text>
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
                leftIcon={<FiExternalLink />}
                colorScheme="blue"
                borderRadius="xl"
                variant="solid"
                alignSelf="start"
                size="sm"
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
