import { supabase } from "../lib/supabase"
import { listingsService } from "../api/listings.service"

export type NotificationType =
  | "created"
  | "price_drop"
  | "price_up"
  | "rented"
  | "favorite_added"
  | "favorite_removed"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  listingId?: number
  thumbnail?: string
  createdAt: string
  is_read?: boolean
}

type Listener = (n: Notification) => void

function normalizeNotificationRow(row: any): Notification {
  return {
    id: String(row?.id),
    type: row?.type,
    title: row?.title ?? "Notificação",
    message: row?.message ?? row?.description ?? undefined,
    listingId: row?.listing_id ?? row?.listingId,
    thumbnail: row?.thumbnail ?? undefined,
    createdAt: row?.created_at ?? new Date().toISOString(),
    is_read: Boolean(row?.is_read)
  }
}

async function enrichNotificationWithListing(notification: Notification) {
  if (!notification.listingId) {
    return notification
  }

  try {
    const rows = await listingsService.listByIds([notification.listingId])
    const listingInfo = normalizeListingInfo(rows[0] ?? {})

    return {
      ...notification,
      title: notification.title ?? listingInfo.title,
      thumbnail: listingInfo.thumbnail ?? notification.thumbnail
    }
  } catch (e) {
    return notification
  }
}

let channel: ReturnType<typeof supabase.channel> | null = null

const listeners = new Set<Listener>()

function emit(n: Notification) {
  for (const l of listeners) l(n)
}

function normalizeListingInfo(listing: any): Partial<Notification> {
  return {
    title: listing?.title ?? "Imóvel",
    thumbnail: listing?.thumbnail_url ?? listing?.images?.[0] ?? undefined
  }
}

export const notificationsService = {
  async start() {
    if (channel) return

    channel = supabase.channel("realtime_notifications")

    channel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "listing_events" },
      async (payload: any) => {
        console.log("[REALTIME EVENT] listing_events INSERT", payload)

        const record = payload.new ?? payload.record ?? payload
        if (record.is_read !== true) {
          return
        }

        const type: NotificationType = record.type

        let base: Partial<Notification> = {
          listingId: record.listing_id,
          createdAt: record.created_at ?? new Date().toISOString()
        }

        if (record.listing_id) {
          try {
            const rows = await listingsService.listByIds([record.listing_id])
            base = { ...base, ...normalizeListingInfo(rows[0] ?? {}) }
          } catch (e) {
            // ignore
          }
        }

        const notification: Notification = {
          id: String(record.id),
          type,
          title:
            record.title ?? (type === "created" ? "Novo imóvel" : "Evento"),
          message: record.description ?? undefined,
          listingId: record.listing_id,
          thumbnail: base.thumbnail,
          createdAt: base.createdAt as string,
          is_read: true
        }

        emit(notification)
      }
    )

    await channel.subscribe()
  },

  async getUnreadNotifications() {
    const response = await supabase
      .from("listing_events")
      .select("id, type, title, description, listing_id, created_at, is_read")
      .eq("is_read", true)
      .order("created_at", { ascending: false })

    if (response.error) throw response.error

    const notifications = (response.data ?? []).map((row: any) =>
      normalizeNotificationRow(row)
    )

    const enrichedNotifications = await Promise.all(
      notifications.map((notification) =>
        enrichNotificationWithListing(notification)
      )
    )

    return enrichedNotifications
  },

  async markAsRead(notificationId: string) {
    const response = await supabase
      .from("listing_events")
      .update({ is_read: false })
      .eq("id", notificationId)
      .select("id, type, title, description, listing_id, created_at, is_read")
      .maybeSingle()

    if (response.error) throw response.error

    if (!response.data) {
      throw new Error("Notificação não encontrada")
    }

    return normalizeNotificationRow(response.data)
  },

  async markAllAsRead() {
    const response = await supabase
      .from("listing_events")
      .update({ is_read: false })
      .eq("is_read", true)
      .select("id, type, title, description, listing_id, created_at, is_read")

    if (response.error) throw response.error

    return (response.data ?? []).map((row: any) =>
      normalizeNotificationRow(row)
    )
  },

  async createEvent(
    event: Omit<Notification, "id" | "createdAt"> & {
      createdAt?: string
    }
  ) {
    const response = await supabase
      .from("listing_events")
      .insert({
        type: event.type,
        title: event.title,
        description: event.message,
        listing_id: event.listingId,
        created_at: event.createdAt ?? new Date().toISOString(),
        is_read: event.is_read ?? true
      })
      .select("id, type, title, description, listing_id, created_at, is_read")
      .maybeSingle()

    if (response.error) throw response.error
    if (!response.data) {
      throw new Error("Falha ao criar evento de notificação")
    }

    return enrichNotificationWithListing(
      normalizeNotificationRow(response.data)
    )
  },

  stop() {
    if (!channel) return
    try {
      channel.unsubscribe()
    } catch (e) {}
    channel = null
  },

  on(fn: Listener) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },

  async notifyLocalFavorite(listingId: number, added: boolean) {
    let listingInfo: Partial<Notification> = {}
    try {
      const rows = await listingsService.listByIds([listingId])
      listingInfo = normalizeListingInfo(rows[0] ?? {})
    } catch (e) {}

    const event: Omit<Notification, "id" | "createdAt"> & {
      createdAt: string
    } = {
      type: added ? "favorite_added" : "favorite_removed",
      title: listingInfo.title ?? (added ? "Favoritado" : "Desfavoritado"),
      message: added ? "Adicionado aos favoritos" : "Removido dos favoritos",
      listingId,
      thumbnail: listingInfo.thumbnail,
      createdAt: new Date().toISOString(),
      is_read: true
    }

    await notificationsService.createEvent(event).catch(() => {})
  }
}

export default notificationsService
