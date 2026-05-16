import {
  Box,
  Flex,
  HStack,
  Stack,
  Text,
  useBreakpointValue
} from "@chakra-ui/react"

import NotificationCenter from "../components/ui/NotificationCenter"

export default function Header() {
  const isMobile = useBreakpointValue({
    base: true,
    lg: false
  })

  // header uses NotificationCenter for realtime notifications

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={50}
      bg="surfaceAccent"
      backdropFilter="blur(18px)"
      borderBottom="1px solid"
      borderBottomColor="border"
    >
      <Flex
        h="78px"
        px={{
          base: 4,
          md: 6,
          xl: 8
        }}
        align="center"
        justify="space-between"
        gap={4}
      >
        <HStack spacing={4}>
          <Stack spacing={0}>
            <Text
              fontSize={{
                base: "2xl",
                md: "xl"
              }}
              fontWeight="800"
              letterSpacing="-0.5px"
              color="white"
              bgGradient="
                linear(
                  to-r,
                  white,
                  gray.300
                )
              "
            >
              Cerquilho Imóveis
            </Text>

            {!isMobile && (
              <Text color="gray.500" fontSize="sm">
                Plataforma analítica imobiliária
              </Text>
            )}
          </Stack>
        </HStack>

        <NotificationCenter />
      </Flex>
    </Box>
  )
}
