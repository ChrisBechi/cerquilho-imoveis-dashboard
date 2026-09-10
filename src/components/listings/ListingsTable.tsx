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
import { FaBath, FaWhatsapp } from "react-icons/fa"
import type { Listing } from "../../types/listing"
import FavoriteButton from "./FavoriteButton"
import ListingsEmptyState from "./ListingsEmptyState"

function generateWhatsAppUrl(listing: Listing): string {
  if (!listing.contact) return ""

  const message = `Olá, fiquei interessado no imóvel ${listing.code ? `com o código '${listing.code}'` : ""} e gostaria de agendar uma visita. Pode ser para o primeiro horário que tiver disponível.`
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/55${listing.contact}?text=${encodedMessage}`
}

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
        <HStack spacing={4} align="center">
          <Image
            loading="lazy"
            src={listing.thumbnail_url || "/property-placeholder.svg"}
            onError={(event) => {
              event.currentTarget.onerror = null
              event.currentTarget.src = "/property-placeholder.svg"
            }}
            w="110px"
            h="78px"
            borderRadius="xl"
            objectFit="cover"
            flexShrink={0}
          />

          <Box minW={0}>
            <Text fontWeight="bold" fontSize="md" mb={1} noOfLines={2}>
              {listing.title}
            </Text>

            <Text color="gray.400" fontSize="sm" noOfLines={1}>
              {listing.neighborhood}
            </Text>
          </Box>
        </HStack>
      </Td>

      <Td>
        <Text noOfLines={2}>{listing.provider}</Text>
      </Td>

      <Td>
        <Text fontWeight="bold" color="blue.300" whiteSpace="nowrap">
          R${" "}
          {listing.price_numeric.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </Text>
      </Td>

      <Td>
        <HStack spacing={5} whiteSpace="nowrap">
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
        <HStack flexWrap="wrap">
          {listing.is_new && <Badge colorScheme="green">Novo</Badge>}
          {listing.is_reduced && <Badge colorScheme="red">Reduziu</Badge>}
          {listing.is_rented && <Badge colorScheme="purple">Alugado</Badge>}
        </HStack>
      </Td>

      <Td>
        <HStack spacing={1} justify="flex-end">
          <FavoriteButton
            isFavorite={isFavorite}
            onClick={(event) => {
              event.stopPropagation()
              toggleFavorite(listing.id.toString())
            }}
          />
          {listing.contact && (
            <IconButton
              aria-label="Agendar visita"
              color="green.300"
              icon={<FaWhatsapp />}
              variant="ghost"
              onClick={(event) => {
                event.stopPropagation()
                window.open(generateWhatsAppUrl(listing), "_blank")
              }}
            />
          )}
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
        </HStack>
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
        <Table variant="simple" style={{ tableLayout: "fixed" }} minW="1160px">
          <colgroup>
            <col style={{ width: "340px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "130px" }} />
            <col style={{ width: "205px" }} />
            <col style={{ width: "170px" }} />
            <col style={{ width: "165px" }} />
          </colgroup>
          <Thead bg="rgba(255,255,255,0.03)">
            <Tr>
              <Th color="gray.300" py={5}>
                Imóvel
              </Th>
              <Th color="gray.300">Provider</Th>
              <Th color="gray.300">Preço</Th>
              <Th color="gray.300">Infos</Th>
              <Th color="gray.300">Status</Th>
              <Th textAlign="right">Ações</Th>
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
