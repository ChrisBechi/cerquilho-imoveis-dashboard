import { Box, Button, Flex, Text } from "@chakra-ui/react"
import { FiChevronDown, FiSliders } from "react-icons/fi"

interface Props {
  onToggleFilters: () => void
}

export default function ListingsToolbar({ onToggleFilters }: Props) {
  return (
    <Flex
      justify="space-between"
      align="center"
      mb={6}
      gap="3rem"
      flexWrap="wrap"
    >
      <Box>
        <Text color="textSecondary" fontSize="sm" mb={1}>
          CENTRAL OPERACIONAL
        </Text>

        <Text fontSize="3xl" fontWeight="bold" color="textPrimary">
          Casas para locação
        </Text>
      </Box>

      <Button
        leftIcon={<FiSliders />}
        rightIcon={<FiChevronDown />}
        onClick={onToggleFilters}
        variant="secondary"
        h="54px"
        w={["100%", "100%", "auto"]}
        px={6}
      >
        Filtros avançados
      </Button>
    </Flex>
  )
}
