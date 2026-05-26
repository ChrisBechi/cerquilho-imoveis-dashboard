import { Divider, Grid, SimpleGrid } from "@chakra-ui/react"

import { FiDollarSign, FiHome, FiTrendingDown } from "react-icons/fi"
import { ImPriceTags } from "react-icons/im"
import { MdOutlineLocalPostOffice } from "react-icons/md"
import { FiArrowUp } from "react-icons/fi"

import KpiCard from "../components/KpiCard"

import MainLayout from "../layouts/MainLayout"

import useDashboardStats from "../hooks/useDashboardStats"
import { useEffect, useRef, useState } from "react"
import { useToast, Button, Box } from "@chakra-ui/react"
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
  const [showScrollButton, setShowScrollButton] = useState(false)

  const exploreRef = useRef<HTMLDivElement>(null)
  const reducedRef = useRef<HTMLDivElement>(null)
  const rentedRef = useRef<HTMLDivElement>(null)
  const listingsRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const handleScroll = () => {
      if (exploreRef.current) {
        const elementPosition = exploreRef.current.getBoundingClientRect().top
        setShowScrollButton(elementPosition < 0)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  const scrollToExplore = () => {
    if (exploreRef.current) {
      const elementPosition =
        exploreRef.current.getBoundingClientRect().top + window.scrollY - 120
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      })
    }
  }

  const [externalSelectedProviders, setExternalSelectedProviders] = useState<
    string[] | null
  >(null)

  const handleProviderClick = (provider: string) => {
    setExternalSelectedProviders([provider])
    if (listingsRef.current) {
      const elementPosition =
        listingsRef.current.getBoundingClientRect().top + window.scrollY - 120
      window.scrollTo({ top: elementPosition, behavior: "smooth" })
    }
  }

  const scrollToReduced = () => {
    if (reducedRef.current) {
      const elementPosition =
        reducedRef.current.getBoundingClientRect().top + window.scrollY - 120
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      })
    }
  }

  const scrollToRented = () => {
    if (rentedRef.current) {
      const elementPosition =
        rentedRef.current.getBoundingClientRect().top + window.scrollY - 120
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      })
    }
  }

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
            onClick={scrollToExplore}
          />

          <KpiCard
            title="Novos"
            value={data?.newListings ?? 0}
            icon={<MdOutlineLocalPostOffice />}
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
            onClick={scrollToExplore}
          />

          <KpiCard
            title="Preço médio"
            value={data?.averagePrice ?? "R$ 0"}
            icon={<FiDollarSign />}
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
            onClick={scrollToExplore}
          />

          <KpiCard
            title="Reduções"
            value={data?.reducedPrices ?? 0}
            icon={<FiTrendingDown />}
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
            onClick={scrollToReduced}
          />

          <KpiCard
            title="Alugados"
            value={data?.rentedCount ?? 0}
            icon={<ImPriceTags />}
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
            onClick={scrollToRented}
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
          <ProvidersChartSection onProviderClick={handleProviderClick} />

          <AveragePriceChartSection />
        </SimpleGrid>
      </FadeIn>
      <FadeIn delay={0.3} ref={exploreRef}>
        <ExploreListingsSection />
      </FadeIn>
      <FadeIn delay={0.4} ref={reducedRef}>
        <ReducedListingsSection />
      </FadeIn>
      <FadeIn delay={0.5} ref={rentedRef}>
        <RentedListingsSection />
      </FadeIn>
      <Divider mt="4rem" borderColor="gray.600" />
      <FadeIn delay={0.6} ref={listingsRef}>
        <ListingsDataGrid
          externalSelectedProviders={externalSelectedProviders}
          onExternalClear={() => {
            setExternalSelectedProviders(null)
          }}
        />
      </FadeIn>

      {showScrollButton && (
        <Box position="fixed" bottom={8} right={8} zIndex={40}>
          <Button
            onClick={scrollToTop}
            size="lg"
            colorScheme="brand"
            background="#041b2ee0"
            border="1px solid white"
            rounded="full"
            boxShadow="lg"
            transition="all 0.2s"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "xl"
            }}
          >
            <FiArrowUp />
          </Button>
        </Box>
      )}
    </MainLayout>
  )
}
