export interface Listing {
  id: number
  title: string
  price: string
  price_numeric: number
  provider: string
  neighborhood: string
  bedrooms: number
  bathrooms: number
  area: number
  thumbnail_url: string
  images?: string[]
  is_new: boolean
  is_favorite?: boolean
  is_reduced: boolean
  is_rented?: boolean
  old_price?: string
  price_difference?: string
  url: string
}

export interface IPriceHistory {
  date: string
  price: number
}

export interface ITimelineEvent {
  type: "created" | "price_drop" | "price_up" | "rented"
  title: string
  description: string
  date: string
}
