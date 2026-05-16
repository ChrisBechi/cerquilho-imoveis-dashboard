import { Box, Button, Flex, Text, type BoxProps } from "@chakra-ui/react"
import { FiRefreshCw, FiSearch } from "react-icons/fi"
import type { ReactNode } from "react"

interface Props extends BoxProps {
  title: string
  description: string
  buttonLabel?: string
  onButtonClick?: () => void
  icon?: ReactNode
}

export default function EmptyState({
  title,
  description,
  buttonLabel,
  onButtonClick,
  icon,
  ...props
}: Props) {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      textAlign="center"
      py={20}
      px={6}
      {...props}
    >
      <Flex
        w="82px"
        h="82px"
        borderRadius="full"
        justify="center"
        align="center"
        bg="glass"
        mb={6}
      >
        <Box>{icon ?? <FiSearch fontSize="34px" color="#94a3b8" />}</Box>
      </Flex>

      <Text fontSize="2xl" fontWeight="bold" mb={2}>
        {title}
      </Text>

      <Text color="textSecondary" maxW="420px" lineHeight="1.7" mb={6}>
        {description}
      </Text>

      {buttonLabel && onButtonClick && (
        <Button
          leftIcon={<FiRefreshCw />}
          variant="secondary"
          onClick={onButtonClick}
        >
          {buttonLabel}
        </Button>
      )}
    </Flex>
  )
}
