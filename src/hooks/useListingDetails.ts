import { useQuery } from "@tanstack/react-query"
import { listingsService } from "../api/listings.service"
import type { ITimelineEvent } from "../types/listing"

export type ListingDetails = {
  price_history: Array<{ date: string; price: number }>
  timeline: ITimelineEvent[]
}

function parsePriceLabel(label: string | null | undefined) {
  if (!label) {
    return undefined
  }

  const normalized = label
    .replace(/[R$\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
  const value = Number(normalized)

  if (!Number.isFinite(value)) {
    return undefined
  }

  return Math.round(value * 100)
}

function getEventPrice(event: any) {
  if (event.type === "created") {
    return (
      event.new_price ??
      event.old_price ??
      parsePriceLabel(event.new_price_label) ??
      parsePriceLabel(event.old_price_label)
    )
  }

  if (event.type === "price_drop" || event.type === "price_up") {
    return event.new_price ?? parsePriceLabel(event.new_price_label)
  }

  return undefined
}

function getPreviousEventPrice(event: any) {
  return event.old_price ?? parsePriceLabel(event.old_price_label)
}

function buildPriceHistoryFromEvents(events: any[]) {
  const priceEvents = events
    .filter(
      (event) =>
        (event.type === "created" ||
          event.type === "price_drop" ||
          event.type === "price_up") &&
        event.created_at
    )
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )

  const firstPriceChange = priceEvents.find(
    (event) => event.type === "price_drop" || event.type === "price_up"
  )
  const originalPriceFromChange = firstPriceChange
    ? getPreviousEventPrice(firstPriceChange)
    : undefined
  const createdIndex = priceEvents.findIndex((event) => event.type === "created")

  const points = priceEvents
    .map((event) => ({
      date: event.created_at,
      price:
        event.type === "created"
          ? (getEventPrice(event) ?? originalPriceFromChange)
          : getEventPrice(event)
    }))
    .filter(
      (point): point is { date: string; price: number } =>
        point.price != null && Number.isFinite(point.price)
    )

  if (createdIndex === -1 && firstPriceChange && originalPriceFromChange != null) {
    points.unshift({
      date: firstPriceChange.created_at,
      price: originalPriceFromChange
    })
  }

  return points.filter((point, index) => {
    const previous = points[index - 1]

    if (!previous) {
      return true
    }

    return previous.price !== point.price || previous.date !== point.date
  })
}

export default function useListingDetails(listingId: number | null) {
  return useQuery<ListingDetails, Error>({
    queryKey: ["listing", listingId],
    enabled: !!listingId,
    queryFn: async (): Promise<ListingDetails> => {
      if (!listingId) return { price_history: [], timeline: [] }

      const events = await listingsService.getEvents(listingId)

      const timeline = events.map((e: any) => ({
        type: e.type,
        title: e.title || e.type,
        description: e.description || "",
        date: e.created_at || "",
        old_price: e.old_price,
        new_price: e.new_price,
        old_price_label: e.old_price_label,
        new_price_label: e.new_price_label
      }))

      return {
        price_history: buildPriceHistoryFromEvents(events),
        timeline
      }
    }
  })
}
