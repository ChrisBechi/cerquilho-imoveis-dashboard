import {
  Badge,
  Box,
  HStack,
  Icon,
  IconButton,
  Image,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react"
import { memo } from "react"
import { FiExternalLink, FiHome } from "react-icons/fi"
import { TbRulerMeasure } from "react-icons/tb"
import { FaBath } from "react-icons/fa"
import type { Listing } from "../../types/listing"
import FavoriteButton from "./FavoriteButton"
import ListingsEmptyState from "./ListingsEmptyState"

interface Props {
  listings: Listing[]
  onSelect: (listing: Listing) => void
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  onReset: () => void
}

interface RowProps {
  listing: Listing
  onSelect: (listing: Listing) => void
  toggleFavorite: (id: string) => void
  isFavorite: boolean
}

const ListingRow = memo(function ListingRow({
  listing,
  onSelect,
  toggleFavorite,
  isFavorite
}: RowProps) {
  return (
    <Tr
      cursor="pointer"
      transition="0.2s"
      _hover={{ bg: "rgba(255,255,255,0.03)" }}
      onClick={() => onSelect(listing)}
    >
      <Td py={5}>
        <HStack spacing={4}>
          <Image
            loading="lazy"
            src={listing.thumbnail_url}
            w="110px"
            h="78px"
            borderRadius="xl"
            objectFit="cover"
          />

          <Box>
            <Text fontWeight="bold" fontSize="md" mb={1}>
              {listing.title}
            </Text>

            <Text color="gray.400" fontSize="sm">
              {listing.neighborhood}
            </Text>
          </Box>
        </HStack>
      </Td>

      <Td>{listing.provider}</Td>

      <Td>
        <Text fontWeight="bold" color="blue.300">
          {listing.price}
        </Text>
      </Td>

      <Td>
        <HStack spacing={5}>
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
      </Td>

      <Td>
        <HStack>
          {listing.is_new && <Badge colorScheme="green">Novo</Badge>}
          {listing.is_reduced && <Badge colorScheme="red">Reduziu</Badge>}
          {listing.is_rented && <Badge colorScheme="purple">Alugado</Badge>}
        </HStack>
      </Td>

      <Td textAlign="center">
        <FavoriteButton
          isFavorite={isFavorite}
          onClick={(event) => {
            event.stopPropagation()
            toggleFavorite(listing.id.toString())
          }}
        />
      </Td>

      <Td>
        <IconButton
          aria-label="Abrir anúncio"
          color="blue.300"
          icon={<FiExternalLink />}
          variant="ghost"
          onClick={(event) => {
            event.stopPropagation()
            window.open(listing.url, "_blank")
          }}
        />
      </Td>
    </Tr>
  )
})

function ListingsTable({
  listings,
  onSelect,
  toggleFavorite,
  isFavorite,
  onReset
}: Props) {
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
    <Box
      overflow="hidden"
      borderRadius="xl"
      border="1px solid"
      borderColor="border"
      bg="surfaceSecondary"
    >
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead bg="rgba(255,255,255,0.03)">
            <Tr>
              <Th py={5}>Imóvel</Th>
              <Th>Provider</Th>
              <Th>Preço</Th>
              <Th>Infos</Th>
              <Th>Status</Th>
              <Th>Favorito</Th>
              <Th />
            </Tr>
          </Thead>

          <Tbody>
            {listings.map((listing) => (
              <ListingRow
                key={listing.id}
                listing={listing}
                onSelect={onSelect}
                toggleFavorite={toggleFavorite}
                isFavorite={isFavorite(listing.id.toString())}
              />
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  )
}

export default memo(ListingsTable)
