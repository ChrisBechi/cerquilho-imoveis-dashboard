import {
  Box,
  Flex,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Stack,
  Text
} from "@chakra-ui/react"
import type { Dispatch, SetStateAction } from "react"
import FilterChip from "../ui/FilterChip"

interface IOwnProps {
  setMinArea: Dispatch<SetStateAction<number>>
  minArea: number
  setMinBedrooms: Dispatch<SetStateAction<number>>
  minBedrooms: number
  setSelectedProviders: Dispatch<SetStateAction<string[]>>
  selectedProviders: string[]
  setSelectedStatuses: Dispatch<SetStateAction<string[]>>
  selectedStatuses: string[]
  priceRange: number[]
  setPriceRange: Dispatch<SetStateAction<number[]>>
  providers: string[]
  minBathrooms: number
  setMinBathrooms: Dispatch<SetStateAction<number>>
}

export default function FiltersContent({
  setMinArea,
  minArea,
  setMinBedrooms,
  minBedrooms,
  setSelectedProviders,
  selectedProviders,
  setSelectedStatuses,
  selectedStatuses,
  priceRange,
  setPriceRange,
  providers,
  minBathrooms,
  setMinBathrooms
}: IOwnProps) {
  return (
    <Stack spacing={6}>
      <Box>
        <Text mb={3} color="gray.400" fontSize="sm" fontWeight="600">
          Imobiliárias
        </Text>

        <Flex gap={2} flexWrap="wrap">
          {providers.map((provider) => {
            const active = selectedProviders.includes(provider)

            return (
              <FilterChip
                key={provider}
                isActive={active}
                onClick={() => {
                  setSelectedProviders((prev) =>
                    active
                      ? prev.filter((item) => item !== provider)
                      : [...prev, provider]
                  )
                }}
              >
                {provider}
              </FilterChip>
            )
          })}
        </Flex>
      </Box>

      <Box>
        <Text mb={3} color="gray.400" fontSize="sm" fontWeight="600">
          Status
        </Text>

        <Flex gap={2} flexWrap="wrap">
          {[
            {
              key: "new",
              label: "Recém adicionados"
            },
            {
              key: "reduced",
              label: "Reduzidos"
            },
            {
              key: "rented",
              label: "Alugados"
            }
          ].map((status) => {
            const active = selectedStatuses.includes(status.key)

            return (
              <FilterChip
                key={status.key}
                isActive={active}
                onClick={() => {
                  setSelectedStatuses((prev) =>
                    active
                      ? prev.filter((item) => item !== status.key)
                      : [...prev, status.key]
                  )
                }}
              >
                {status.label}
              </FilterChip>
            )
          })}
        </Flex>
      </Box>

      <Box>
        <Text mb={3} color="gray.400" fontSize="sm" fontWeight="600">
          Quartos
        </Text>

        <Flex gap={2} flexWrap="wrap">
          {[0, 1, 2, 3, 4].map((value) => (
            <FilterChip
              key={value}
              isActive={minBedrooms === value}
              onClick={() => setMinBedrooms(value)}
            >
              {value === 0 ? "Todos" : `${value}+`}
            </FilterChip>
          ))}
        </Flex>
      </Box>

      <Box>
        <Text mb={3} color="gray.400" fontSize="sm" fontWeight="600">
          Banheiros
        </Text>

        <Flex gap={2} flexWrap="wrap">
          {[0, 1, 2, 3].map((value) => (
            <FilterChip
              key={value}
              isActive={minBathrooms === value}
              onClick={() => setMinBathrooms(value)}
            >
              {value === 0 ? "Todos" : `${value}+`}
            </FilterChip>
          ))}
        </Flex>
      </Box>

      <Box>
        <Text mb={3} color="gray.400" fontSize="sm" fontWeight="600">
          Área mínima
        </Text>

        <Flex gap={2} flexWrap="wrap">
          {[0, 50, 100, 150].map((value) => (
            <FilterChip
              key={value}
              isActive={minArea === value}
              onClick={() => setMinArea(value)}
            >
              {value === 0 ? "Todas" : `${value}m²+`}
            </FilterChip>
          ))}
        </Flex>
      </Box>

      <Box>
        <Flex justify="space-between" align="center" mb={3}>
          <Text color="gray.400" fontSize="sm" fontWeight="600">
            Preço
          </Text>

          <Text color="blue.300" fontWeight="bold" fontSize="sm">
            R$ {priceRange[0]} — R$ {priceRange[1]}
          </Text>
        </Flex>

        <RangeSlider
          min={0}
          max={10000}
          step={100}
          defaultValue={priceRange}
          onChangeEnd={(value) => setPriceRange(value)}
        >
          <RangeSliderTrack bg="whiteAlpha.100">
            <RangeSliderFilledTrack bg="blue.500" />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} />
          <RangeSliderThumb index={1} />
        </RangeSlider>
      </Box>
    </Stack>
  )
}
