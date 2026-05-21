import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef
} from "react"
import { useToast } from "@chakra-ui/react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import notificationsService from "../services/notifications.service"
import type { Notification } from "../services/notifications.service"

interface NotificationsContextData {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
}

const NotificationsContext = createContext({} as NotificationsContextData)

export function NotificationsProvider({
  children
}: {
  children: React.ReactNode
}) {
  const toast = useToast()
  const queryClient = useQueryClient()

  const { data: notifications = [], isLoading } = useQuery<
    Notification[],
    Error
  >({
    queryKey: ["notifications", "unread"],
    queryFn: notificationsService.getUnreadNotifications,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  const unsubRef = useRef<(() => void) | null>(null)
  const notificationServiceRef = useRef(false)

  useEffect(() => {
    if (notificationServiceRef.current) return
    notificationServiceRef.current = true

    notificationsService.start()

    unsubRef.current = notificationsService.on((n) => {
      queryClient.setQueryData<Notification[]>(
        ["notifications", "unread"],
        (prev = []) => [n, ...prev]
      )

      let title = n.title
      let description = n.message ?? undefined

      switch (n.type) {
        case "created":
          title = `🏠 ${title}`
          break
        case "price_drop":
          title = `📉 ${title}`
          break
        case "price_up":
          title = `📈 ${title}`
          break
        case "rented":
          title = `🔑 ${title}`
          break
        case "favorite_added":
          title = `❤️ ${title}`
          break
        case "favorite_removed":
          title = `💔 ${title}`
          break
      }

      toast({
        title,
        description,
        status: "info",
        duration: 5000,
        isClosable: true
      })
    })

    return () => {
      if (unsubRef.current) {
        unsubRef.current()
      }
      notificationsService.stop()
      notificationServiceRef.current = false
    }
  }, [])

  const markAsRead = useCallback(
    async (id: string) => {
      try {
        await notificationsService.markAsRead(id)
      } catch (error) {
        console.error("Erro ao marcar notificação como lida:", error)
        // Ainda remove da UI mesmo com erro, mas loga para debug
      }

      queryClient.setQueryData<Notification[]>(
        ["notifications", "unread"],
        (prev = []) => prev.filter((notification) => notification.id !== id)
      )
    },
    [queryClient]
  )

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsService.markAllAsRead()
    } catch (error) {
      console.error("Erro ao marcar todas as notificações como lidas:", error)
      // Ainda limpa a UI mesmo com erro, mas loga para debug
    }

    queryClient.setQueryData<Notification[]>(["notifications", "unread"], [])
  }, [queryClient])

  const unreadCount = useMemo(() => notifications.length, [notifications])

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      isLoading,
      markAsRead,
      markAllAsRead
    }),
    [notifications, unreadCount, isLoading, markAsRead, markAllAsRead]
  )

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  return useContext(NotificationsContext)
}
