import { Box, Flex, Text, type BoxProps, Skeleton, Button } from "@chakra-ui/react"
import type { ReactNode } from "react"

interface Props extends BoxProps {
  title: string
  value: string | number
  icon?: ReactNode
  isLoading?: boolean
  error?: string | Error | null
  onRetry?: () => void
}

export default function StatCard({ title, value, icon, isLoading, error, ...props }: Props) {
  return (
    <Box p={6} bg="surfaceSecondary" border="1px solid" borderColor="border" boxShadow="soft" borderRadius="2xl" {...props}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text color="textSecondary" fontSize="sm">
          {title}
        </Text>
        {icon}
      </Flex>
      {isLoading ? (
        <Skeleton height={{ base: "2.25rem", md: "3rem" }} w="40%" />
      ) : error ? (
        <Flex align="center" gap={3}>
          <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold">
            —
          </Text>
          {props.onRetry && (
            <Button size="sm" onClick={props.onRetry} variant="ghost">
              Tentar novamente
            </Button>
          )}
        </Flex>
      ) : (
        <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold">
          {value}
        </Text>
      )}
    </Box>
  )
}
