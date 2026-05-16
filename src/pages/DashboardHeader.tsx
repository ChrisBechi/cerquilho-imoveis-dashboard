import { Box } from "@chakra-ui/react"

import SectionTitle from "../components/ui/SectionTitle"

export default function DashboardHeader() {
  return (
    <Box
      mb={10}
      position="relative"
      overflow="hidden"
      borderRadius="32px"
      px={{ base: 6, md: 10 }}
      py={{ base: 8, md: 10 }}
      bg="linear-gradient(135deg, #0f172a 0%, #111827 45%, #1e293b 100%)"
      border="1px solid"
      borderColor="whiteAlpha.100"
      boxShadow="0 20px 60px rgba(0,0,0,0.35)"
    >
      <Box
        position="absolute"
        top="-120px"
        right="-120px"
        w="280px"
        h="280px"
        borderRadius="full"
        bg="blue.500"
        opacity={0.12}
        filter="blur(90px)"
      />

      <Box
        position="absolute"
        bottom="-140px"
        left="-120px"
        w="260px"
        h="260px"
        borderRadius="full"
        bg="purple.500"
        opacity={0.12}
        filter="blur(90px)"
      />

      <SectionTitle
        mb={0}
        title="Painel imobiliário de Cerquilho"
        description="
            Acompanhe imóveis recém adicionados, reduções de preço,
            imóveis alugados e movimentações do mercado imobiliário
            em tempo real.
          "
      />
    </Box>
  )
}
