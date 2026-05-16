import {
  Box,
  Button,
  HStack,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
  Stack,
  Text,
  VStack,
  Image
} from "@chakra-ui/react"
import { FiBell } from "react-icons/fi"
import { useNotifications } from "../../context/NotificationsContext"

export default function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications
  } = useNotifications()

  return (
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
            _hover={{ bg: "glassHover" }}
          />

          {unreadCount > 0 && <FlexBadge count={unreadCount} />}
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
          <FlexHeader
            notifications={notifications}
            markAllAsRead={markAllAsRead}
            clearNotifications={clearNotifications}
          />

          <VStack align="stretch" spacing={0}>
            {notifications.length === 0 ? (
              <Box p={5}>
                <Text color="gray.400">Nenhuma notificação</Text>
              </Box>
            ) : (
              <Stack spacing={0}>
                {notifications.map((n) => (
                  <Box
                    key={n.id}
                    px={4}
                    py={3}
                    borderBottom="1px solid"
                    borderBottomColor="border"
                  >
                    <HStack align="start" spacing={3}>
                      {n.thumbnail && (
                        <Image
                          src={n.thumbnail}
                          w="52px"
                          h="52px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                      )}
                      <Box flex={1}>
                        <Text fontWeight="bold">{n.title}</Text>
                        {n.message && (
                          <Text color="gray.400" fontSize="sm">
                            {n.message}
                          </Text>
                        )}
                        <HStack mt={2} spacing={2}>
                          <Button size="sm" onClick={() => markAsRead(n.id)}>
                            Marcar como lida
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeNotification(n.id)}
                          >
                            Remover
                          </Button>
                        </HStack>
                      </Box>
                    </HStack>
                  </Box>
                ))}
              </Stack>
            )}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

function FlexHeader({ markAllAsRead, clearNotifications }: any) {
  return (
    <Box
      px={5}
      py={4}
      borderBottom="1px solid"
      borderBottomColor="border"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Box>
        <Text fontWeight="bold" fontSize="lg">
          Notificações
        </Text>
        <Text fontSize="sm" color="textSecondary">
          Últimas atualizações do sistema
        </Text>
      </Box>

      <HStack spacing={2}>
        <Button size="sm" onClick={markAllAsRead}>
          Marcar todas
        </Button>
        <Button size="sm" variant="ghost" onClick={clearNotifications}>
          Limpar
        </Button>
      </HStack>
    </Box>
  )
}

function FlexBadge({ count }: { count: number }) {
  return (
    <Box
      position="absolute"
      top="-6px"
      right="-6px"
      minW="22px"
      h="22px"
      px={2}
      borderRadius="full"
      bg="linear-gradient(180deg,#ff5f5f,#ff2d2d)"
      justifyContent="center"
      alignItems="center"
      display="flex"
      fontSize="10px"
      fontWeight="bold"
      color="white"
      boxShadow="0 4px 12px rgba(255,45,45,0.45)"
      border="2px solid #11151d"
    >
      {count > 99 ? "99+" : count}
    </Box>
  )
}
