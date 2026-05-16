import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react"
import { useToast } from "@chakra-ui/react"
import notificationsService from "../services/notifications.service"
import type { Notification } from "../services/notifications.service"

interface NotificationsContextData {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

const NotificationsContext = createContext({} as NotificationsContextData)

export function NotificationsProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const toast = useToast()

  useEffect(() => {
    notificationsService.start()

    const unsub = notificationsService.on((n) => {
      setNotifications((prev) => [n, ...prev])

      // show toast for important events
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
      unsub()
      notificationsService.stop()
    }
  }, [toast])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  )

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearNotifications
    }),
    [
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearNotifications
    ]
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
