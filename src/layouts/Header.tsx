import {
  Badge,
  Box,
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useBreakpointValue,
  VStack
} from "@chakra-ui/react"

import { FiBell, FiDollarSign, FiHome, FiTrendingDown } from "react-icons/fi"

export default function Header() {
  const isMobile = useBreakpointValue({
    base: true,
    lg: false
  })

  const notifications = [
    {
      id: 1,
      title: "Preço reduzido",
      description: "Casa no Centro caiu R$ 300",
      icon: FiTrendingDown,
      color: "red.400",
      time: "Agora"
    },

    {
      id: 2,
      title: "Novo imóvel",
      description: "Apartamento adicionado no Di Napoli",
      icon: FiHome,
      color: "green.400",
      time: "5 min"
    },

    {
      id: 3,
      title: "Valor atualizado",
      description: "Prime Imóveis atualizou 4 anúncios",
      icon: FiDollarSign,
      color: "blue.400",
      time: "12 min"
    }
  ]

  const notificationsCount = notifications.length

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

        <Popover placement="bottom-end">
          <PopoverTrigger>
            <Box position="relative">
              <IconButton
                aria-label="Notificações"
                icon={<FiBell />}
                variant="ghost"
                color="textSecondary"
                borderRadius="xl"
                bg="glass"
                border="1px solid"
                borderColor="border"
                _hover={{
                  bg: "glassHover"
                }}
              />

              <Flex
                position="absolute"
                top="-6px"
                right="-6px"
                minW="22px"
                h="22px"
                px={2}
                borderRadius="full"
                bg="
          linear-gradient(
            180deg,
            #ff5f5f,
            #ff2d2d
          )
        "
                justify="center"
                align="center"
                fontSize="10px"
                fontWeight="bold"
                color="white"
                boxShadow="
          0 4px 12px
          rgba(255,45,45,0.45)
        "
                border="
          2px solid
          #11151d
        "
              >
                {notificationsCount > 99 ? "99+" : notificationsCount}
              </Flex>
            </Box>
          </PopoverTrigger>

          <PopoverContent
            bg="surfaceSecondary"
            border="1px solid"
            borderColor="border"
            borderRadius="2xl"
            overflow="hidden"
            w="360px"
            boxShadow="card"
          >
            <PopoverArrow bg="surfaceSecondary" />

            <PopoverBody p={0}>
              <Flex
                justify="space-between"
                align="center"
                px={5}
                py={4}
                borderBottom="1px solid"
                borderBottomColor="border"
              >
                <Box>
                  <Text fontWeight="bold" fontSize="lg">
                    Notificações
                  </Text>

                  <Text fontSize="sm" color="textSecondary">
                    Atualizações do sistema
                  </Text>
                </Box>

                <Badge colorScheme="red" borderRadius="full" px={2}>
                  {notificationsCount}
                </Badge>
              </Flex>

              <Stack spacing={0}>
                {notifications.map((notification, index) => (
                  <Box
                    key={notification.id}
                    px={5}
                    py={4}
                    transition="0.2s"
                    cursor="pointer"
                    _hover={{
                      bg: "glass"
                    }}
                  >
                    <HStack align="start" spacing={4}>
                      <Flex
                        w="42px"
                        h="42px"
                        borderRadius="xl"
                        bg="glass"
                        justify="center"
                        align="center"
                        flexShrink={0}
                      >
                        <Icon
                          as={notification.icon}
                          color={notification.color}
                          fontSize="18px"
                        />
                      </Flex>

                      <VStack align="start" spacing={1} flex={1}>
                        <Flex justify="space-between" w="100%" gap={3}>
                          <Text fontWeight="600" fontSize="sm">
                            {notification.title}
                          </Text>

                          <Text fontSize="xs" color="gray.500" flexShrink={0}>
                            {notification.time}
                          </Text>
                        </Flex>

                        <Text fontSize="sm" color="gray.400" lineHeight="1.5">
                          {notification.description}
                        </Text>
                      </VStack>
                    </HStack>

                    {index !== notifications.length - 1 && (
                      <Divider
                        mt={4}
                        borderColor="
                    whiteAlpha.100
                  "
                      />
                    )}
                  </Box>
                ))}
              </Stack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
    </Box>
  )
}
