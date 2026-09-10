import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
  Skeleton,
  SimpleGrid,
  Button,
  Heading,
  useToast
} from "@chakra-ui/react"
import {
  useCallback,
  useDeferredValue,
  useMemo,
  useState,
  useEffect
} from "react"
import { FiSearch } from "react-icons/fi"
import type { Listing } from "../../types/listing"
import useListings from "../../hooks/useListings"
import { useFavorites } from "../../context/FavoritesContext"
import { useListingDrawer } from "../../context/ListingDrawerContext"
import FiltersContent from "./FiltersContent"
import ListingsFiltersSidebar from "./ListingsFiltersSidebar"
import ListingsMobile from "./ListingsMobile"
import ListingsTable from "./ListingsTable"
import ListingsToolbar from "./ListingsToolbar"
import ActiveFilters from "./ActiveFilters"
import LoadMoreButton from "./LoadMoreButton"

interface Props {
  externalSelectedProviders?: string[] | null
  onExternalClear?: () => void
}

export default function ListingsDataGrid({
  externalSelectedProviders,
  onExternalClear
}: Props) {
  const isMobile = useBreakpointValue({ base: true, lg: false })
  const { isOpen, onToggle } = useDisclosure()
  const { openDrawer } = useListingDrawer()
  const [search, setSearch] = useState("")
  const deferredSearch = useDeferredValue(search)
  const [selectedProviders, setSelectedProviders] = useState<string[]>([])
  const [minBedrooms, setMinBedrooms] = useState(0)
  const [minBathrooms, setMinBathrooms] = useState(0)
  const [minArea, setMinArea] = useState(0)
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  type SortOption = "recent" | "cheap" | "expensive" | "area"
  const sortBy = "recent" as SortOption
  const [visibleCount, setVisibleCount] = useState(5)
  const { toggleFavorite, isFavorite } = useFavorites()

  const { data: listings = [], isLoading, error, refetch } = useListings(200)
  const toast = useToast()

  const handleSelectListing = useCallback(
    (listing: Listing) => {
      openDrawer(listing)
    },
    [openDrawer]
  )

  if (error) {
    toast({
      title: "Erro ao carregar listagens",
      status: "error",
      duration: 5000,
      isClosable: true
    })
  }

  const providers = useMemo(
    () => Array.from(new Set(listings.map((listing: any) => listing.provider))),
    [listings]
  )

  const filteredListings = useMemo(() => {
    const normalizedSearch = deferredSearch.toLowerCase()

    const filtered = listings.filter((listing: any) => {
      const matchesSearch =
        listing.title.toLowerCase().includes(normalizedSearch) ||
        listing.neighborhood.toLowerCase().includes(normalizedSearch)

      const matchesProvider =
        selectedProviders.length === 0 ||
        selectedProviders.includes(listing.provider)

      const matchesBedrooms = listing.bedrooms >= minBedrooms
      const matchesBathrooms = listing.bathrooms >= minBathrooms
      const matchesArea = listing.area >= minArea
      const matchesPrice =
        listing.price_numeric >= priceRange[0] &&
        listing.price_numeric <= priceRange[1]

      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.some((status) => {
          if (status === "new") {
            return listing.is_new
          }
          if (status === "reduced") {
            return listing.is_reduced
          }
          if (status === "rented") {
            return listing.is_rented
          }
          return false
        })

      const matchesNotRented = !listing.is_rented

      return (
        matchesSearch &&
        matchesProvider &&
        matchesBedrooms &&
        matchesBathrooms &&
        matchesArea &&
        matchesPrice &&
        matchesStatus &&
        matchesNotRented
      )
    })

    switch (sortBy) {
      case "cheap":
        filtered.sort((a, b) => a.price_numeric - b.price_numeric)
        break
      case "expensive":
        filtered.sort((a, b) => b.price_numeric - a.price_numeric)
        break
      case "area":
        filtered.sort((a, b) => b.area - a.area)
        break
      default:
        filtered.sort((a, b) => Number(b.is_new) - Number(a.is_new))
    }

    return filtered
  }, [
    deferredSearch,
    selectedProviders,
    minBedrooms,
    minBathrooms,
    minArea,
    priceRange,
    selectedStatuses,
    sortBy,
    listings
  ])

  const visibleListings = filteredListings.slice(0, visibleCount)
  const hasActiveFilters =
    selectedProviders.length > 0 ||
    selectedStatuses.length > 0 ||
    minBedrooms > 0 ||
    minBathrooms > 0 ||
    minArea > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 10000

  const resetFilters = useCallback(() => {
    setSearch("")
    setSelectedProviders([])
    setSelectedStatuses([])
    setMinBedrooms(0)
    setMinBathrooms(0)
    setMinArea(0)
    setPriceRange([0, 10000])
    onExternalClear?.()
  }, [])

  useEffect(() => {
    if (externalSelectedProviders && externalSelectedProviders.length > 0) {
      setSelectedProviders(externalSelectedProviders)
    }
  }, [externalSelectedProviders])

  return (
    <Box mt={14}>
      <ListingsToolbar onToggleFilters={onToggle} />

      {hasActiveFilters && (
        <ActiveFilters
          selectedProviders={selectedProviders}
          minBedrooms={minBedrooms}
          minBathrooms={minBathrooms}
          minArea={minArea}
          setSelectedProviders={setSelectedProviders}
          setMinBedrooms={setMinBedrooms}
          setMinBathrooms={setMinBathrooms}
          setMinArea={setMinArea}
          onClearFilters={resetFilters}
        />
      )}

      <InputGroup w="100%" mb={5}>
        <InputLeftElement
          h="46px"
          pointerEvents="none"
          color="gray.400"
        >
          <Icon as={FiSearch} fontSize="17px" />
        </InputLeftElement>

        <Input
          pl="44px"
          h="46px"
          borderRadius="xl"
          placeholder="Buscar imóvel..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          bg="rgba(30, 41, 59, 0.72)"
          border="1px solid"
          borderColor="rgba(148, 163, 184, 0.18)"
          boxShadow="0 8px 24px rgba(0, 0, 0, 0.12)"
          transition="border-color 0.2s, box-shadow 0.2s, background 0.2s"
          _hover={{
            bg: "rgba(30, 41, 59, 0.88)",
            borderColor: "rgba(148, 163, 184, 0.3)"
          }}
          _focusVisible={{
            bg: "rgba(30, 41, 59, 0.96)",
            borderColor: "blue.400",
            boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.16)"
          }}
        />
      </InputGroup>

      <Flex gap={5} align="start">
        <Box flex={1} minW={0}>
          {isLoading ? (
            <SimpleGrid columns={{ base: 1, md: 2, xl: 1 }} spacing={4}>
              {Array.from({ length: 4 }).map((_, idx) => (
                <Box key={idx} bg="surfaceSecondary" borderRadius="xl" p={4}>
                  <Skeleton height="14px" w="60%" />
                  <Skeleton height="12px" mt={3} w="40%" />
                  <Skeleton height="160px" mt={4} borderRadius="md" />
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
          ) : isMobile === true ? (
            <ListingsMobile
              listings={visibleListings}
              onSelect={handleSelectListing}
              onReset={resetFilters}
            />
          ) : (
            <ListingsTable
              listings={visibleListings}
              onSelect={handleSelectListing}
              toggleFavorite={toggleFavorite}
              isFavorite={isFavorite}
              onReset={resetFilters}
            />
          )}
        </Box>

        {!isMobile && isOpen && (
          <ListingsFiltersSidebar
            minArea={minArea}
            minBedrooms={minBedrooms}
            minBathrooms={minBathrooms}
            selectedProviders={selectedProviders}
            selectedStatuses={selectedStatuses}
            priceRange={priceRange}
            providers={providers}
            setMinArea={setMinArea}
            setMinBedrooms={setMinBedrooms}
            setMinBathrooms={setMinBathrooms}
            setSelectedProviders={setSelectedProviders}
            setSelectedStatuses={setSelectedStatuses}
            setPriceRange={setPriceRange}
            onClose={onToggle}
          />
        )}

        {isMobile && (
          <Drawer
            isOpen={isOpen}
            placement="bottom"
            onClose={onToggle}
            size="full"
          >
            <DrawerOverlay bg="rgba(0,0,0,0.4)" backdropFilter="blur(6px)" />
            <DrawerContent bg="#11151d" borderTopRadius="3xl" maxH="85vh">
              <DrawerCloseButton mt={2} />
              <DrawerHeader borderBottom="1px solid rgba(255,255,255,0.08)">
                <Text fontSize="lg" fontWeight="bold">
                  Filtros
                </Text>
              </DrawerHeader>
              <DrawerBody py={6}>
                <Stack spacing={6}>
                  <FiltersContent
                    setMinArea={setMinArea}
                    minArea={minArea}
                    setMinBedrooms={setMinBedrooms}
                    minBedrooms={minBedrooms}
                    setMinBathrooms={setMinBathrooms}
                    minBathrooms={minBathrooms}
                    setSelectedProviders={setSelectedProviders}
                    selectedProviders={selectedProviders}
                    setSelectedStatuses={setSelectedStatuses}
                    selectedStatuses={selectedStatuses}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    providers={providers}
                  />
                </Stack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        )}
      </Flex>

      {visibleCount < filteredListings.length && (
        <Flex justify="center" mt={6}>
          <LoadMoreButton onClick={() => setVisibleCount((prev) => prev + 5)} />
        </Flex>
      )}
    </Box>
  )
}
