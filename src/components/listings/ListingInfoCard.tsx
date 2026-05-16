import { Box, Icon, Text } from "@chakra-ui/react"
import type { ElementType } from "react"

interface Props {
  icon: ElementType
  label: string
  value: string | number
}

export default function ListingInfoCard({ icon, label, value }: Props) {
  return (
    <Box flex={1} minW="110px" bg="whiteAlpha.50" borderRadius="2xl" p={4}>
      <Icon as={icon} mb={3} fontSize="20px" />

      <Text color="gray.400" fontSize="sm">
        {label}
      </Text>

      <Text fontWeight="bold" fontSize="lg">
        {value}
      </Text>
    </Box>
  )
}
