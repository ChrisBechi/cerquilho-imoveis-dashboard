import { Box } from "@chakra-ui/react"
import SectionTitle from "../components/ui/SectionTitle"

export default function DashboardHeader() {
  return (
    <Box mb={10} p={{ base: 5, md: 8 }}>
      <SectionTitle
        title="Painel imobiliário de Cerquilho"
        description="Acompanhe imóveis recém adicionados, reduções de preço, imóveis alugados e tendências do mercado em tempo real."
      />
    </Box>
  )
}
