import { centsToBRL } from "./formatters"
import type { Listing } from "../types/listing"

type ListingRow = {
  id: number
  title: string
  provider: string
  neighborhood: string
  bedrooms: number
  bathrooms: number
  area: number
  thumbnail_url: string
  current_price: number | null
  price_label?: string | null
  rented_at?: string | null
  url: string
  code?: string | null
  contact?: string | null
}

type ListingEventRow = {
  listing_id: number
  type: string
  created_at: string
  old_price?: number | null
  new_price?: number | null
  old_price_label?: string | null
  new_price_label?: string | null
}

type ListingImageRow = {
  listing_id: number
  url?: string | null
  image_url?: string | null
  src?: string | null
  path?: string | null
}

type ListingPriceHistoryRow = {
  listing_id: number
  price: number
  date: string
}

const getImageUrl = (image: ListingImageRow) => {
  // Prefer the explicit `image_url` column. Keep fallbacks for legacy fields.
  return image.image_url || image.url || image.src || image.path || undefined
}

const formatOldPrice = (price: number | null | undefined) => {
  if (price == null) return undefined
  return centsToBRL(price)
}

const getLatestHistoryPrice = (history: ListingPriceHistoryRow[]) => {
  if (!history?.length) return undefined

  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return sortedHistory[0]?.price
}

const getOldPriceCents = (
  history: ListingPriceHistoryRow[],
  currentPrice: number | null | undefined
) => {
  if (!history?.length) return undefined

  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const [latest, previous] = sortedHistory
  if (!latest) return undefined

  if (previous) {
    return previous.price
  }

  if (currentPrice != null && latest.price !== currentPrice) {
    return latest.price
  }

  return undefined
}

const getPriceDifference = (
  oldPriceCents: number | null | undefined,
  currentPrice: number | null | undefined
) => {
  if (oldPriceCents == null || currentPrice == null) return undefined

  const diff = Math.abs(oldPriceCents - currentPrice)
  return centsToBRL(diff)
}

const getPriceDropEvent = (events: ListingEventRow[]) => {
  const dropEvents = events
    .filter((event) => event.type === "price_drop")
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

  return dropEvents[0]
}

const getIsNew = (events: ListingEventRow[]) => {
  const createdEvents = events
    .filter((event) => event.type === "created")
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

  if (!createdEvents.length) return false

  const createdAt = new Date(createdEvents[0].created_at).getTime()
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

  return createdAt >= sevenDaysAgo
}

const getIsReduced = (events: ListingEventRow[]) => {
  if (!events.length) return false
  const sorted = [...events].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  return sorted[0].type === "price_drop"
}

const normalizeImages = (
  images: ListingImageRow[] | undefined,
  thumbnailUrl?: string
) => {
  const normalized = (images ?? [])
    .map(getImageUrl)
    .filter((url): url is string => Boolean(url))

  if (normalized.length) return normalized
  if (thumbnailUrl) return [thumbnailUrl]
  return []
}

export function normalizeListing(
  row: ListingRow,
  images: ListingImageRow[] = [],
  events: ListingEventRow[] = [],
  history: ListingPriceHistoryRow[] = []
): Listing {
  const priceDropEvent = getPriceDropEvent(events)
  const currentPriceFromEvent = priceDropEvent?.new_price ?? undefined
  const oldPriceFromEvent = priceDropEvent?.old_price ?? undefined

  const currentPrice =
    row.current_price ??
    currentPriceFromEvent ??
    getLatestHistoryPrice(history) ??
    null
  const oldPriceCents =
    oldPriceFromEvent ?? getOldPriceCents(history, currentPrice)
  const oldPrice = formatOldPrice(oldPriceCents)
  const oldPriceNumeric =
    oldPriceCents != null ? Math.round(oldPriceCents / 100) : undefined
  const priceDropPercentage =
    oldPriceCents != null && currentPrice != null && oldPriceCents > 0
      ? Math.round(((oldPriceCents - currentPrice) / oldPriceCents) * 100)
      : undefined

  return {
    id: row.id,
    title: row.title,
    price: row.price_label
      ? String(row.price_label)
      : currentPrice != null
        ? centsToBRL(currentPrice)
        : "",
    price_numeric: currentPrice != null ? Math.round(currentPrice / 100) : 0,
    provider: row.provider,
    neighborhood: row.neighborhood,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    area: row.area,
    thumbnail_url: row.thumbnail_url,
    images: normalizeImages(images, row.thumbnail_url),
    is_new: getIsNew(events),
    is_reduced: getIsReduced(events),
    is_rented: row.rented_at != null,
    old_price: oldPrice,
    old_price_numeric: oldPriceNumeric,
    price_difference: getPriceDifference(oldPriceCents, currentPrice),
    price_drop_percentage: priceDropPercentage,
    url: row.url,
    code: row.code || undefined,
    contact: row.contact || undefined
  }
}
