import { useEffect, useRef } from "react"
import { useNotifications } from "../context/NotificationsContext"

/**
 * Componente que sincroniza o título da página com o número de notificações não lidas
 * Captura o título original do index.html e o usa como base
 * Deve ser posicionado dentro do NotificationsProvider
 */
export function NotificationTitleUpdater() {
  const { unreadCount } = useNotifications()
  const baseTitleRef = useRef<string | null>(null)

  // Efeito 1: Captura o título original apenas uma vez
  useEffect(() => {
    baseTitleRef.current = document.title
  }, [])

  // Efeito 2: Atualiza o título quando unreadCount muda
  useEffect(() => {
    const baseTitle = baseTitleRef.current

    if (unreadCount === 0) {
      document.title = baseTitle || ""
    } else {
      const displayCount = unreadCount > 99 ? "99+" : unreadCount
      document.title = `(${displayCount}) ${baseTitle}`
    }
  }, [unreadCount])

  // Este componente não renderiza nada, apenas gerencia side effects
  return null
}
