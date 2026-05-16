import { Box, type BoxProps } from "@chakra-ui/react"

export default function SurfaceContainer({ children, ...props }: BoxProps) {
  return (
    <Box
      bg="surfaceSecondary"
      border="1px solid"
      borderColor="border"
      boxShadow="card"
      borderRadius="xl"
      {...props}
    >
      {children}
    </Box>
  )
}
