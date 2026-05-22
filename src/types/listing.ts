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
  old_price_numeric?: number
  price_difference?: string
  price_drop_percentage?: number
  url: string
  code?: string
  contact?: string
  price_reduced_at?: string
  rented_at?: string
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
  old_price?: number
  new_price?: number
  old_price_label?: string
  new_price_label?: string
}
