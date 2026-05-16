import { Box, Flex, Heading, Progress, Stack, Text, Skeleton, Button, useToast } from "@chakra-ui/react"

import { useProviderAverages } from "../hooks/useProviderAnalytics"

export default function AveragePriceChartSection() {
  const { data: averages = [], isLoading, error, refetch } = useProviderAverages()
  const toast = useToast()

  if (error) {
    toast({ title: "Erro ao carregar médias", status: "error", duration: 5000, isClosable: true })
  }

  if (error) {
    return (
      <Box bg="surfaceSecondary" borderRadius="2xl" p={8} border="1px solid" borderColor="border">
        <Heading size="md" mb={2}>Erro ao carregar dados</Heading>
        <Text color="gray.400" mb={4}>{String(error)}</Text>
        <Button onClick={() => refetch()}>Tentar novamente</Button>
      </Box>
    )
  }

  const data = (averages || []).map((d) => ({ name: d.provider, average: Math.round(d.average / 100), formatted: d.formatted }))

  const highestPrice = data.length ? Math.max(...data.map((item) => item.average)) : 0

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
      h="100%"
    >
      <Text color="gray.400" fontSize="sm" mb={2}>
        VALORES MÉDIOS
      </Text>

      <Heading size="lg" mb={2}>
        Preço médio por imobiliária
      </Heading>

      <Text color="gray.400" mb={8}>
        Comparativo médio dos valores anunciados entre os providers.
      </Text>

      <Stack spacing={5}>
        {isLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <Box key={idx}>
                <Flex justify="space-between" mb={2}>
                  <Skeleton height="16px" w="40%" />
                  <Skeleton height="20px" w="80px" />
                </Flex>

                <Skeleton height="12px" />
              </Box>
            ))
          : data.map((provider) => (
              <Box key={provider.name}>
                <Flex justify="space-between" mb={2}>
                  <Text fontWeight="medium">{provider.name}</Text>

                  <Text color="gray.300" fontWeight="bold">
                    R$ {provider.average.toLocaleString("pt-BR")}
                  </Text>
                </Flex>

                <Progress
                  value={(provider.average / highestPrice) * 100}
                  borderRadius="full"
                  bg="whiteAlpha.100"
                  sx={{
                    "& > div": {
                      background: "linear-gradient(90deg, #4F8CFF, #7C5CFF)"
                    }
                  }}
                />
              </Box>
            ))}
      </Stack>
    </Box>
  )
}
