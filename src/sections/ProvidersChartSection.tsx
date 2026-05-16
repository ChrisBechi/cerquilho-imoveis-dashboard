import { Box, Flex, Grid, Heading, Stack, Text, Skeleton, Button, useToast } from "@chakra-ui/react"

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

import { useProviderCounts } from "../hooks/useProviderAnalytics"

const COLORS = ["#4F8CFF", "#7C5CFF", "#22C55E", "#F59E0B", "#EC4899"]

export default function ProvidersChartSection() {
  const { data: counts = [], isLoading, error, refetch } = useProviderCounts()
  const toast = useToast()

  if (error) {
    toast({ title: "Erro ao carregar dados de providers", status: "error", duration: 5000, isClosable: true })
  }

  const data = (counts || []).map((c) => ({ name: c.provider, value: c.count }))

  const total = data.reduce((acc, item) => acc + item.value, 0)

  if (error) {
    return (
      <Box bg="surfaceSecondary" borderRadius="2xl" p={8} border="1px solid" borderColor="border">
        <Heading size="md" mb={2}>Erro ao carregar dados</Heading>
        <Text color="gray.400" mb={4}>{String(error)}</Text>
        <Button onClick={() => refetch()}>Tentar novamente</Button>
      </Box>
    )
  }

  return (
    <Box
      bg="surfaceSecondary"
      borderRadius="2xl"
      p={{
        base: 5,
        md: 8
      }}
      border="1px solid"
      borderColor="border"
      overflow="hidden"
    >
      <Grid
        templateColumns={{
          base: "1fr",
          xl: "2fr 1fr"
        }}
        gap={[3]}
        alignItems="center"
      >
        <Box>
          <Text color="gray.400" fontSize="sm" mb={2}>
            MARKET SHARE
          </Text>

          <Heading size="lg" mb={2}>
            Imóveis por imobiliária
          </Heading>

          <Text color="gray.400" maxW="420px">
            Distribuição atual dos imóveis ativos entre as imobiliárias
            monitoradas.
          </Text>
        </Box>
        <Flex
          w="100%"
          maxW="200px"
          h="150px"
          position="relative"
          justify="center"
          align="center"
          mx="auto"
        >
          <Box
            position="absolute"
            w="200px"
            h="200px"
            borderRadius="full"
            bg="blue.500"
            opacity={0.08}
            filter="blur(90px)"
          />
          {isLoading ? (
            <Flex position="absolute" direction="column" align="center">
              <Skeleton boxSize="56px" borderRadius="full" />
              <Skeleton height="2rem" mt={3} w="60px" />
            </Flex>
          ) : (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={70}
                    paddingAngle={4}
                    stroke="none"
                    width={5}
                  >
                    {data.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <Flex position="absolute" direction="column" align="center">
                <Text fontSize="2.8rem" fontWeight="bold" lineHeight="1">
                  {total}
                </Text>

                <Text fontSize="sm" color="gray.400" mt={2}>
                  imóveis
                </Text>
              </Flex>
            </>
          )}
        </Flex>
      </Grid>
      <Stack spacing={6} mt={5}>
        <Grid
          templateColumns="
              repeat(2, minmax(0, 1fr))
            "
          gap={4}
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <Flex
                  key={idx}
                  justify={["center", "center", "space-between"]}
                  gap={3}
                  flexDirection={["column-reverse", "column-reverse", "row"]}
                  bg="whiteAlpha.50"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  borderRadius="2xl"
                  p={5}
                >
                  <Stack spacing={2}>
                    <Flex align="center" gap={3}>
                      <Skeleton boxSize="12px" borderRadius="full" />
                      <Skeleton height="16px" w="120px" />
                    </Flex>
                    <Skeleton height="12px" w="80px" />
                  </Stack>
                  <Box mt={4}>
                    <Skeleton height="28px" w="60px" />
                  </Box>
                </Flex>
              ))
            : data.map((provider, index) => (
                <Flex
                  key={provider.name}
                  justify={["center", "center", "space-between"]}
                  gap={3}
                  flexDirection={["column-reverse", "column-reverse", "row"]}
                  bg="whiteAlpha.50"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  borderRadius="2xl"
                  p={5}
                  transition="0.2s"
                  _hover={{
                    bg: "whiteAlpha.100",
                    transform: "translateY(-2px)"
                  }}
                >
                  <Stack spacing={2}>
                    <Flex align="center" gap={3}>
                      <Box
                        w="12px"
                        h="12px"
                        borderRadius="full"
                        bg={COLORS[index % COLORS.length]}
                      />

                      <Text fontWeight="semibold" fontSize="md">
                        {provider.name}
                      </Text>
                    </Flex>
                    <Text color="gray.400" mt={1}>
                      {((provider.value / total) * 100).toFixed(0)}% do total
                    </Text>
                  </Stack>
                  <Box mt={4}>
                    <Text
                      fontSize="3xl"
                      fontWeight="bold"
                      lineHeight="1"
                      textAlign={["center", "center", "right"]}
                    >
                      {provider.value}
                    </Text>
                  </Box>
                </Flex>
              ))}
        </Grid>
      </Stack>
    </Box>
  )
}
