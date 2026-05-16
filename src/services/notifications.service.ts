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
  read?: boolean
}

type Listener = (n: Notification) => void

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
          id: `le:${Date.now()}:${Math.random().toString(36).slice(2, 9)}`,
          type,
          title:
            record.title ?? (type === "created" ? "Novo imóvel" : "Evento"),
          message: record.description ?? undefined,
          listingId: record.listing_id,
          thumbnail: base.thumbnail,
          createdAt: base.createdAt as string,
          read: false
        }

        emit(notification)
      }
    )

    channel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "favorites" },
      async (payload: any) => {
        console.log("[REALTIME EVENT] favorites INSERT", payload)

        const record = payload.new ?? payload.record ?? payload
        const listingId = record.listing_id

        let listingInfo: Partial<Notification> = {}
        if (listingId) {
          try {
            const rows = await listingsService.listByIds([listingId])
            listingInfo = normalizeListingInfo(rows[0] ?? {})
          } catch (e) {}
        }

        const n: Notification = {
          id: `fav:add:${Date.now()}:${Math.random().toString(36).slice(2, 9)}`,
          type: "favorite_added",
          title: listingInfo.title ?? "Favoritado",
          message: "Imóvel adicionado aos favoritos",
          listingId,
          thumbnail: listingInfo.thumbnail,
          createdAt: new Date().toISOString(),
          read: false
        }

        emit(n)
      }
    )

    channel.on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "favorites" },
      async (payload: any) => {
        console.log("[REALTIME EVENT] favorites DELETE", payload)

        const record = payload.old ?? payload.record ?? payload
        const listingId = record.listing_id

        let listingInfo: Partial<Notification> = {}
        if (listingId) {
          try {
            const rows = await listingsService.listByIds([listingId])
            listingInfo = normalizeListingInfo(rows[0] ?? {})
          } catch (e) {}
        }

        const n: Notification = {
          id: `fav:rm:${Date.now()}:${Math.random().toString(36).slice(2, 9)}`,
          type: "favorite_removed",
          title: listingInfo.title ?? "Desfavoritado",
          message: "Imóvel removido dos favoritos",
          listingId,
          thumbnail: listingInfo.thumbnail,
          createdAt: new Date().toISOString(),
          read: false
        }

        emit(n)
      }
    )

    channel.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "listings" },
      async (payload: any) => {
        console.log("[REALTIME EVENT] listings UPDATE", payload)

        const oldRec = payload.old ?? payload.previous ?? {}
        const rec = payload.new ?? payload.record ?? payload

        // detect rented change
        if (!oldRec.rented_at && rec.rented_at) {
          let listingInfo: Partial<Notification> = {}
          try {
            const rows = await listingsService.listByIds([rec.id])
            listingInfo = normalizeListingInfo(rows[0] ?? {})
          } catch (e) {}

          const n: Notification = {
            id: `lst:rented:${Date.now()}:${Math.random().toString(36).slice(2, 9)}`,
            type: "rented",
            title: listingInfo.title ?? "Imóvel alugado",
            message: "Imóvel marcado como alugado",
            listingId: rec.id,
            thumbnail: listingInfo.thumbnail,
            createdAt: new Date().toISOString(),
            read: false
          }

          emit(n)
        }
      }
    )

    await channel.subscribe()
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

    const n: Notification = {
      id: `localfav:${added ? "add" : "rm"}:${Date.now()}:${Math.random().toString(36).slice(2, 9)}`,
      type: added ? "favorite_added" : "favorite_removed",
      title: listingInfo.title ?? (added ? "Favoritado" : "Desfavoritado"),
      message: added ? "Adicionado aos favoritos" : "Removido dos favoritos",
      listingId,
      thumbnail: listingInfo.thumbnail,
      createdAt: new Date().toISOString(),
      read: false
    }

    emit(n)
  }
}

export default notificationsService
