import { Divider, Grid, SimpleGrid } from "@chakra-ui/react"

import {
  FiDollarSign,
  FiHome,
  FiTrendingDown,
  FiTrendingUp
} from "react-icons/fi"

import KpiCard from "../components/KpiCard"

import MainLayout from "../layouts/MainLayout"

import useDashboardStats from "../hooks/useDashboardStats"
import { useEffect } from "react"
import { useToast } from "@chakra-ui/react"
import DashboardHeader from "./DashboardHeader"
import ExploreListingsSection from "../sections/ExploreListingsSection"
import ReducedListingsSection from "../sections/ReducedListingsSection"
import RentedListingsSection from "../sections/RentedListingsSection"
import ProvidersChartSection from "../sections/ProvidersChartSection"
import AveragePriceChartSection from "../sections/AveragePriceChartSection"
import FadeIn from "../components/FadeIn"
import ListingsDataGrid from "../components/listings/ListingsDataGrid"

export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useDashboardStats()
  const toast = useToast()

  useEffect(() => {
    if (error) {
      toast({
        title: "Erro ao carregar métricas",
        status: "error",
        duration: 5000,
        isClosable: true
      })
    }
  }, [error, toast])

  return (
    <MainLayout>
      <DashboardHeader />
      <FadeIn delay={0.1}>
        <Grid
          templateColumns={{
            base: "1fr 1fr",
            xl: "repeat(5, 1fr)"
          }}
          gap={5}
          mb={10}
        >
          <KpiCard
            title="Ativos"
            value={data?.totalActive ?? 0}
            icon={<FiHome />}
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
          />

          <KpiCard
            title="Novos"
            value={data?.newListings ?? 0}
            icon={<FiHome />}
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
          />

          <KpiCard
            title="Preço médio"
            value={data?.averagePrice ?? "R$ 0"}
            icon={<FiDollarSign />}
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
          />

          <KpiCard
            title="Reduções"
            value={data?.reducedPrices ?? 0}
            icon={<FiTrendingDown />}
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
          />

          <KpiCard
            title="Aumentos"
            value={data?.increasedPrices ?? 0}
            icon={<FiTrendingUp />}
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
          />
        </Grid>
      </FadeIn>
      <FadeIn delay={0.2}>
        <SimpleGrid
          columns={{
            base: 1,
            xl: 2
          }}
          spacing={6}
          my={14}
        >
          <ProvidersChartSection />

          <AveragePriceChartSection />
        </SimpleGrid>
      </FadeIn>
      <FadeIn delay={0.3}>
        <ExploreListingsSection />
      </FadeIn>
      <FadeIn delay={0.4}>
        <ReducedListingsSection />
      </FadeIn>
      <FadeIn delay={0.5}>
        <RentedListingsSection />
      </FadeIn>
      <Divider mt="4rem" borderColor="gray.600" />
      <FadeIn delay={0.6}>
        <ListingsDataGrid />
      </FadeIn>
    </MainLayout>
  )
}
