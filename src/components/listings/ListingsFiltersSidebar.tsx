import { Box, Flex, IconButton, Stack, Text } from "@chakra-ui/react"
import type { Dispatch, SetStateAction } from "react"
import { FiX } from "react-icons/fi"
import FiltersContent from "./FiltersContent"

interface Props {
  minArea: number
  minBedrooms: number
  minBathrooms: number
  selectedProviders: string[]
  selectedStatuses: string[]
  priceRange: number[]
  providers: string[]
  setMinArea: Dispatch<SetStateAction<number>>
  setMinBedrooms: Dispatch<SetStateAction<number>>
  setMinBathrooms: Dispatch<SetStateAction<number>>
  setSelectedProviders: Dispatch<SetStateAction<string[]>>
  setSelectedStatuses: Dispatch<SetStateAction<string[]>>
  setPriceRange: Dispatch<SetStateAction<number[]>>
  onClose: () => void
}

export default function ListingsFiltersSidebar({
  minArea,
  minBedrooms,
  minBathrooms,
  selectedProviders,
  selectedStatuses,
  priceRange,
  providers,
  setMinArea,
  setMinBedrooms,
  setMinBathrooms,
  setSelectedProviders,
  setSelectedStatuses,
  setPriceRange,
  onClose
}: Props) {
  return (
    <Box
      w="340px"
      flexShrink={0}
      position="sticky"
      top="20px"
      bg="surfaceSecondary"
      border="1px solid"
      borderColor="border"
      borderRadius="xl"
      p={6}
      h="fit-content"
    >
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontWeight="bold" fontSize="lg">
            Filtros
          </Text>

          <Text fontSize="sm" color="gray.400">
            Ajuste sua busca
          </Text>
        </Box>

        <IconButton
          aria-label="Fechar"
          size="sm"
          borderRadius="full"
          onClick={onClose}
          icon={<FiX />}
          variant="ghost"
        />
      </Flex>

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
    </Box>
  )
}
