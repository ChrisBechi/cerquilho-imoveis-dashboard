import { Box, type BoxProps } from "@chakra-ui/react"

export default function GlassCard({ children, ...props }: BoxProps) {
  return (
    <Box
      bg="glass"
      border="1px solid"
      borderColor="border"
      boxShadow="soft"
      borderRadius="xl"
      backdropFilter="blur(12px)"
      {...props}
    >
      {children}
    </Box>
  )
}
