import { Box, Flex, Heading, Text } from "@chakra-ui/react"

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type RenderableText
} from "recharts"

interface PricePoint {
  date: string

  price: number
}

interface Props {
  data: PricePoint[]
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  }).format(value)
}

export default function PriceHistoryChart({ data }: Props) {
  const currentPrice = data[data.length - 1]?.price

  const oldestPrice = data[0]?.price

  const difference = currentPrice - oldestPrice

  const isLower = difference < 0

  return (
    <Box
      bg="whiteAlpha.50"
      borderRadius="2xl"
      p={5}
      border="1px solid"
      borderColor="whiteAlpha.100"
    >
      <Flex justify="space-between" align="start" mb={5}>
        <Box>
          <Text color="gray.400" fontSize="sm" mb={1}>
            HISTÓRICO DE PREÇO
          </Text>

          <Heading size="md">Evolução do imóvel</Heading>
        </Box>

        <Box textAlign="right">
          <Text
            fontSize="lg"
            fontWeight="bold"
            color={isLower ? "green.300" : "red.300"}
          >
            {isLower ? "-" : "+"}

            {formatCurrency(Math.abs(difference))}
          </Text>

          <Text color="gray.400" fontSize="sm">
            desde o início
          </Text>
        </Box>
      </Flex>

      <Box h="220px">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F8CFF" stopOpacity={0.35} />

                <stop offset="100%" stopColor="#4F8CFF" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              padding={{
                left: 24,
                right: 24
              }}
              tick={{
                fill: "#94A3B8",
                fontSize: 12
              }}
            />

            <YAxis hide domain={["dataMin - 200", "dataMax + 200"]} />

            <Tooltip
              contentStyle={{
                background: "#11151d",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px",
                color: "white"
              }}
              formatter={(value) => formatCurrency(Number(value))}
            />

            <Area
              type="monotone"
              dataKey="price"
              stroke="#4F8CFF"
              strokeWidth={3}
              fill="
    url(#priceGradient)
  "
              label={{
                position: "top",
                fill: "#CBD5E1",
                fontSize: 12,
                formatter: (value: RenderableText) =>
                  typeof value === "number"
                    ? new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        maximumFractionDigits: 0
                      }).format(value)
                    : value
              }}
              dot={{
                r: 4,
                fill: "#4F8CFF",
                strokeWidth: 0
              }}
              activeDot={{
                r: 6
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  )
}
