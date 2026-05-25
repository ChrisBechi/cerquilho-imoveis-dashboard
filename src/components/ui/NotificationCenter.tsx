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
import { FiBell, FiX } from "react-icons/fi"
import { memo, useCallback } from "react"
import { useNotifications } from "../../context/NotificationsContext"
import { useListingDrawer } from "../../context/ListingDrawerContext"
import useListings from "../../hooks/useListings"

const SCROLLBAR_STYLES = {
  "&::-webkit-scrollbar": {
    width: "8px",
    background: "transparent"
  },
  "&::-webkit-scrollbar-track": {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "999px"
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(255,255,255,0.16)",
    borderRadius: "999px"
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "rgba(255,255,255,0.28)"
  }
}

function formatTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()

  const minute = 1000 * 60
  const hour = minute * 60
  const day = hour * 24
  const month = day * 30
  const year = day * 365

  if (diffMs < minute) return "Agora"
  if (diffMs < hour)
    return `${Math.floor(diffMs / minute)} minuto${Math.floor(diffMs / minute) === 1 ? "" : "s"}`
  if (diffMs < day)
    return `${Math.floor(diffMs / hour)} hora${Math.floor(diffMs / hour) === 1 ? "" : "s"}`
  if (diffMs < month)
    return `${Math.floor(diffMs / day)} dia${Math.floor(diffMs / day) === 1 ? "" : "s"}`
  if (diffMs < year)
    return `${Math.floor(diffMs / month)} mês${Math.floor(diffMs / month) === 1 ? "" : "es"}`
  return `${Math.floor(diffMs / year)} ano${Math.floor(diffMs / year) === 1 ? "" : "s"}`
}

const NotificationSkeleton = memo(() => (
  <Box px={4} py={3} borderBottom="1px solid" borderBottomColor="border">
    <Box height="16px" bg="gray.700" borderRadius="md" mb={2} />
    <Box height="12px" bg="gray.700" borderRadius="md" mb={2} w="80%" />
    <Box height="10px" bg="gray.600" borderRadius="md" w="40%" />
  </Box>
))

const NotificationItem = memo(
  ({
    notification,
    onMarkAsRead,
    onOpenListing
  }: {
    notification: any
    onMarkAsRead: (id: string) => void
    onOpenListing: (listingId: number) => void
  }) => (
    <Box
      position="relative"
      px={4}
      py={3}
      borderBottom="1px solid"
      borderBottomColor="border"
      cursor={notification.listingId ? "pointer" : "default"}
      _hover={
        notification.listingId
          ? { bg: "rgba(255,255,255,0.05)" }
          : undefined
      }
      transition="background-color 0.2s"
      onClick={() => {
        if (notification.listingId) {
          onOpenListing(notification.listingId)
        }
      }}
    >
      <IconButton
        aria-label="Marcar como lida"
        icon={<FiX />}
        variant="ghost"
        size="sm"
        position="absolute"
        top="0px"
        right="0px"
        onClick={(e) => {
          e.stopPropagation()
          onMarkAsRead(notification.id)
        }}
      />
      <HStack align="start" spacing={3}>
        {notification.thumbnail && (
          <Image
            src={notification.thumbnail}
            w="52px"
            h="52px"
            objectFit="cover"
            borderRadius="md"
            loading="lazy"
          />
        )}
        <Box flex={1}>
          <Text fontWeight="bold">{notification.title}</Text>
          {notification.message && (
            <Text color="gray.400" fontSize="sm" mb={1}>
              {notification.message}
            </Text>
          )}
          <Text color="gray.500" fontSize="xs">
            {formatTimeAgo(notification.createdAt)}
          </Text>
        </Box>
      </HStack>
    </Box>
  )
)

const LOADING_SKELETONS = Array.from({ length: 3 }, (_, i) => i)

const NotificationCenter = memo(function NotificationCenter() {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } =
    useNotifications()
  const { openDrawer } = useListingDrawer()
  const { data: listings = [] } = useListings(50)

  const handleOpenListing = useCallback(
    (listingId: number) => {
      const listing = listings.find((l) => l.id === listingId)
      if (listing) {
        openDrawer(listing)
      }
    },
    [listings, openDrawer]
  )

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
        maxH="60vh"
        boxShadow="card"
      >
        <PopoverArrow bg="surfaceSecondary" />
        <PopoverBody p={0}>
          <FlexHeader
            onMarkAllAsRead={markAllAsRead}
            hasNotifications={notifications.length > 0}
          />

          <Box maxH="calc(60vh - 92px)" overflowY="auto" sx={SCROLLBAR_STYLES}>
            <VStack align="stretch" spacing={0}>
              {isLoading ? (
                LOADING_SKELETONS.map((idx) => (
                  <NotificationSkeleton key={idx} />
                ))
              ) : notifications.length === 0 ? (
                <Box p={5}>
                  <Text color="gray.400">Nenhuma notificação</Text>
                </Box>
              ) : (
                <Stack spacing={0}>
                  {notifications.map((n) => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      onMarkAsRead={markAsRead}
                      onOpenListing={handleOpenListing}
                    />
                  ))}
                </Stack>
              )}
            </VStack>
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
})

const FlexHeader = memo(function FlexHeader({
  onMarkAllAsRead,
  hasNotifications
}: {
  onMarkAllAsRead: () => void
  hasNotifications: boolean
}) {
  return (
    <HStack
      px={5}
      py={4}
      borderBottom="1px solid"
      borderBottomColor="border"
      display="flex"
      w="100%"
      alignItems="center"
      justifyContent="space-between"
    >
      <Text fontWeight="bold" fontSize="lg">
        Notificações
      </Text>
      <Button
        size="sm"
        variant="ghost"
        color="textSecondary"
        _hover={{ bg: "glassHover" }}
        onClick={onMarkAllAsRead}
        isDisabled={!hasNotifications}
      >
        Marcar como lido
      </Button>
    </HStack>
  )
})

const FlexBadge = memo(function FlexBadge({ count }: { count: number }) {
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
      sx={{
        animation: "scaleInBadge 0.3s ease-out",
        "@keyframes scaleInBadge": {
          "0%": {
            transform: "scale(0)",
            opacity: 0
          },
          "50%": {
            transform: "scale(1.1)"
          },
          "100%": {
            transform: "scale(1)",
            opacity: 1
          }
        }
      }}
    >
      {count > 99 ? "99+" : count}
    </Box>
  )
})

export default NotificationCenter
