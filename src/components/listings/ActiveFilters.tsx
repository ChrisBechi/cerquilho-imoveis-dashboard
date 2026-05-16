import { Button, Flex, Wrap, WrapItem } from "@chakra-ui/react"
import type { Dispatch, SetStateAction } from "react"

interface Props {
  selectedProviders: string[]
  minBedrooms: number
  minBathrooms: number
  minArea: number
  setSelectedProviders: Dispatch<SetStateAction<string[]>>
  setMinBedrooms: Dispatch<SetStateAction<number>>
  setMinBathrooms: Dispatch<SetStateAction<number>>
  setMinArea: Dispatch<SetStateAction<number>>
  onClearFilters: () => void
}

export default function ActiveFilters({
  selectedProviders,
  minBedrooms,
  minBathrooms,
  minArea,
  setSelectedProviders,
  setMinBedrooms,
  setMinBathrooms,
  setMinArea,
  onClearFilters
}: Props) {
  return (
    <Flex my={4} justify="space-between" align="center" gap={4} flexWrap="wrap">
      <Wrap spacing={3}>
        {selectedProviders.map((provider) => (
          <WrapItem key={provider}>
            <Button
              size="sm"
              borderRadius="full"
              bg="rgba(255,255,255,0.06)"
              color="gray.200"
              _hover={{ bg: "rgba(255,255,255,0.1)" }}
              onClick={() => {
                setSelectedProviders((prev) =>
                  prev.filter((item) => item !== provider)
                )
              }}
            >
              {provider} ✕
            </Button>
          </WrapItem>
        ))}

        {minBedrooms > 0 && (
          <WrapItem>
            <Button
              size="sm"
              borderRadius="full"
              bg="rgba(255,255,255,0.06)"
              color="gray.200"
              onClick={() => setMinBedrooms(0)}
            >
              {minBedrooms}+ Quartos ✕
            </Button>
          </WrapItem>
        )}

        {minBathrooms > 0 && (
          <WrapItem>
            <Button
              size="sm"
              borderRadius="full"
              bg="rgba(255,255,255,0.06)"
              color="gray.200"
              onClick={() => setMinBathrooms(0)}
            >
              {minBathrooms}+ Banheiros ✕
            </Button>
          </WrapItem>
        )}

        {minArea > 0 && (
          <WrapItem>
            <Button
              size="sm"
              borderRadius="full"
              bg="rgba(255,255,255,0.06)"
              color="gray.200"
              onClick={() => setMinArea(0)}
            >
              {minArea}m²+ ✕
            </Button>
          </WrapItem>
        )}
      </Wrap>

      <Button
        size="sm"
        variant="ghost"
        color="red.300"
        _hover={{ bg: "rgba(255,0,0,0.08)" }}
        onClick={onClearFilters}
      >
        Limpar filtros
      </Button>
    </Flex>
  )
}
