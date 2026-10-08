export function isRentedCoverImage(url: string) {
  return url.startsWith("https://i.imgur.com/qK0Bms2.png")
}

// The frame is embedded in the artwork. Crop in proportion to the source so
// enlarging the image cannot reveal it again.
export const RENTED_COVER_CLIP_PATH = "inset(4% 2.5% round 24px)"
export const RENTED_COVER_SCALE = 1.09

const sourceWidth = 1672
const sourceHeight = 941
const cropX = 0.025
const cropY = 0.04
const visibleWidth = 1 - 2 * cropX
const visibleHeight = 1 - 2 * cropY

export const RENTED_COVER_ASPECT_RATIO =
  (sourceWidth * visibleWidth) / (sourceHeight * visibleHeight)

export const RENTED_COVER_IMAGE_LAYOUT = {
  width: `${100 / visibleWidth}%`,
  height: `${100 / visibleHeight}%`,
  left: `${(-100 * cropX) / visibleWidth}%`,
  top: `${(-100 * cropY) / visibleHeight}%`
}
