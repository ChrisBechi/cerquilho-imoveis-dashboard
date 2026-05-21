import { Box, Flex, Heading, Icon, Stack, Text } from "@chakra-ui/react"

import { FiArrowDown, FiArrowUp, FiCheckCircle, FiClock } from "react-icons/fi"
import { centsToBRL } from "../utils/formatters"

interface TimelineItem {
  type: "created" | "price_drop" | "price_up" | "rented"

  title: string

  description: string

  date: string

  old_price?: number

  new_price?: number

  old_price_label?: string

  new_price_label?: string
}

interface Props {
  items: TimelineItem[]
}

function getEventConfig(type: TimelineItem["type"]) {
  switch (type) {
    case "price_drop":
      return {
        icon: FiArrowDown,
        color: "green.400",
        bg: "rgba(34,197,94,0.12)"
      }

    case "price_up":
      return {
        icon: FiArrowUp,
        color: "red.400",
        bg: "rgba(239,68,68,0.12)"
      }

    case "rented":
      return {
        icon: FiCheckCircle,
        color: "purple.400",
        bg: "rgba(168,85,247,0.12)"
      }

    default:
      return {
        icon: FiClock,
        color: "blue.400",
        bg: "rgba(59,130,246,0.12)"
      }
  }
}

export default function ListingTimeline({ items }: Props) {
  return (
    <Box
      bg="whiteAlpha.50"
      borderRadius="2xl"
      p={5}
      border="1px solid"
      borderColor="whiteAlpha.100"
    >
      <Heading size="md" mb={6}>
        Timeline do imóvel
      </Heading>

      <Stack spacing={6} position="relative">
        <Box
          position="absolute"
          left="20px"
          top="10px"
          bottom="10px"
          w="2px"
          bg="
            linear-gradient(
              to bottom,
              rgba(255,255,255,0.18),
              transparent
            )
          "
        />

        {items.map((item) => {
          const config = getEventConfig(item.type)

          return (
            <Flex
              key={item.title + item.date}
              gap={4}
              position="relative"
              zIndex={1}
            >
              <Flex
                minW="42px"
                h="42px"
                borderRadius="full"
                justify="center"
                align="center"
                bg={config.bg}
                border="
                  1px solid
                  rgba(255,255,255,0.08)
                "
                color={config.color}
                boxShadow={`
                  0 0 20px ${config.bg}
                `}
              >
                <Icon as={config.icon} fontSize="18px" />
              </Flex>

              <Box flex={1}>
                <Flex justify="space-between" align="start" mb={1} gap={4}>
                  <Text fontWeight="bold">{item.title}</Text>

                  <Text color="gray.500" fontSize="sm" whiteSpace="nowrap">
                    {formatDateBR(item.date)}
                  </Text>
                </Flex>

                <Stack spacing={2}>
                  <Text color="gray.400" fontSize="sm" lineHeight="1.6">
                    {item.description}
                  </Text>

                  {(item.type === "price_drop" || item.type === "price_up") &&
                  (item.old_price != null ||
                    item.old_price_label ||
                    item.new_price != null ||
                    item.new_price_label) ? (
                    <Text color="white" fontSize="sm" fontWeight="semibold">
                      de{" "}
                      <Text
                        as="span"
                        color="gray.300"
                        textDecoration="line-through"
                      >
                        {item.old_price_label ??
                          (item.old_price != null
                            ? centsToBRL(item.old_price)
                            : "--")}
                      </Text>{" "}
                      para{" "}
                      {item.new_price_label ??
                        (item.new_price != null
                          ? centsToBRL(item.new_price)
                          : "--")}
                    </Text>
                  ) : null}
                </Stack>
              </Box>
            </Flex>
          )
        })}
      </Stack>
    </Box>
  )
}

function formatDateBR(dateStr: string) {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr

  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")

  return `${day}/${month}/${year} ${hours}:${minutes}`
}
