export function isRentedCoverImage(url: string) {
  return url.startsWith("https://i.imgur.com/qK0Bms2.png")
}

// The frame is embedded in the artwork. Crop in proportion to the source so
// enlarging the image cannot reveal it again.
export const RENTED_COVER_CLIP_PATH = "inset(4% 2.5% round 24px)"
export const RENTED_COVER_SCALE = 1.09
