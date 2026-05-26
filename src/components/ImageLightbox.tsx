import {
  Box,
  Flex,
  HStack,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text
} from "@chakra-ui/react"

import { AnimatePresence, motion } from "framer-motion"

import { useEffect, useRef, useState } from "react"

import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi"

const MotionImage = motion(Image)

interface Props {
  isOpen: boolean

  onClose: () => void

  images: string[]

  initialIndex?: number
}

export default function ImageLightbox({
  isOpen,
  onClose,
  images,
  initialIndex = 0
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex)

  const thumbnailsRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const minScale = 1
  const maxScale = 4

  const pinchState = useRef<{
    initialDistance?: number
    initialScale?: number
    initialTranslate?: { x: number; y: number }
  }>({})

  const panState = useRef<{ lastX?: number; lastY?: number; isPanning?: boolean }>(
    {}
  )
  const thumbnailsDragState = useRef<{
    startX?: number
    startY?: number
    scrollLeft?: number
    moved?: boolean
  }>({})

  useEffect(() => {
    setSelectedIndex(initialIndex)
  }, [initialIndex])

  useEffect(() => {
    const container = thumbnailsRef.current

    if (!container) {
      return
    }

    const activeThumb = container.children[selectedIndex] as HTMLElement

    activeThumb?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest"
    })
  }, [selectedIndex])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen) {
        return
      }

      if (event.key === "Escape") {
        onClose()
      }

      if (event.key === "ArrowRight") {
        nextImage()
      }

      if (event.key === "ArrowLeft") {
        previousImage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  useEffect(() => {
    if (scale <= 1) {
      setTranslate({ x: 0, y: 0 })
    }
  }, [scale])

  useEffect(() => {
    setScale(1)
    setTranslate({ x: 0, y: 0 })
  }, [selectedIndex, isOpen])

  function clamp(v: number, a: number, b: number) {
    return Math.max(a, Math.min(b, v))
  }

  function limitTranslate(
    nextTranslate: { x: number; y: number },
    nextScale = scale
  ) {
    const container = containerRef.current
    const image = imgRef.current

    if (!container || !image || nextScale <= 1) {
      return { x: 0, y: 0 }
    }

    const maxX = Math.max(
      0,
      (image.offsetWidth * nextScale - container.clientWidth) / 2
    )
    const maxY = Math.max(
      0,
      (image.offsetHeight * nextScale - container.clientHeight) / 2
    )

    return {
      x: clamp(nextTranslate.x, -maxX, maxX),
      y: clamp(nextTranslate.y, -maxY, maxY)
    }
  }

  function handleWheel(e: React.WheelEvent | WheelEvent) {
    const target = e.target as Node | null

    if (target && thumbnailsRef.current?.contains(target)) {
      return
    }

    e.preventDefault()

    const rect = imgRef.current?.getBoundingClientRect()
    if (!rect) return

    const delta = -e.deltaY
    const zoom = delta > 0 ? 1.08 : 0.92
    const newScale = clamp(scale * zoom, minScale, maxScale)

    const cx =
      (e.clientX ?? window.innerWidth / 2) - (rect.left + rect.width / 2)
    const cy =
      (e.clientY ?? window.innerHeight / 2) - (rect.top + rect.height / 2)

    const factor = newScale / scale - 1

    setTranslate((t) =>
      limitTranslate({ x: t.x - cx * factor, y: t.y - cy * factor }, newScale)
    )
    setScale(newScale)
  }

  function distance(touches: React.TouchList) {
    const a = touches[0]
    const b = touches[1]
    const dx = a.clientX - b.clientX
    const dy = a.clientY - b.clientY
    return Math.hypot(dx, dy)
  }

  function midpoint(touches: React.TouchList) {
    const a = touches[0]
    const b = touches[1]
    return { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 }
  }

  function handleTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      e.preventDefault()
      pinchState.current.initialDistance = distance(e.touches)
      pinchState.current.initialScale = scale
      pinchState.current.initialTranslate = translate
    } else if (e.touches.length === 1 && scale > 1) {
      panState.current.lastX = e.touches[0].clientX
      panState.current.lastY = e.touches[0].clientY
    }
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (e.touches.length === 2 && pinchState.current.initialDistance) {
      e.preventDefault()
      const d = distance(e.touches)
      const newScale = clamp(
        (pinchState.current.initialScale || 1) *
          (d / pinchState.current.initialDistance),
        minScale,
        maxScale
      )

      const mp = midpoint(e.touches)
      const rect = imgRef.current?.getBoundingClientRect()
      if (rect) {
        const cx = mp.x - (rect.left + rect.width / 2)
        const cy = mp.y - (rect.top + rect.height / 2)
        const factor = newScale / (pinchState.current.initialScale || 1) - 1
        const initialTranslate = pinchState.current.initialTranslate || {
          x: 0,
          y: 0
        }

        setTranslate(
          limitTranslate(
            {
              x: initialTranslate.x - cx * factor,
              y: initialTranslate.y - cy * factor
            },
            newScale
          )
        )
      }

      setScale(newScale)
    } else if (
      e.touches.length === 1 &&
      scale > 1 &&
      panState.current.lastX != null
    ) {
      e.preventDefault()
      const x = e.touches[0].clientX
      const y = e.touches[0].clientY
      const dx = x - (panState.current.lastX || x)
      const dy = y - (panState.current.lastY || y)
      panState.current.lastX = x
      panState.current.lastY = y
      setTranslate((t) => limitTranslate({ x: t.x + dx, y: t.y + dy }))
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (e.touches.length < 2) {
      pinchState.current = {}
    }
    if (e.touches.length === 0) {
      panState.current = {}
      if (scale <= 1) {
        setTranslate({ x: 0, y: 0 })
      }
    }
  }

  function handlePointerDown(e: React.PointerEvent<HTMLImageElement>) {
    if (scale <= 1 || e.pointerType === "touch") {
      return
    }

    e.currentTarget.setPointerCapture(e.pointerId)
    panState.current = {
      lastX: e.clientX,
      lastY: e.clientY,
      isPanning: true
    }
  }

  function handlePointerMove(e: React.PointerEvent<HTMLImageElement>) {
    if (scale <= 1 || !panState.current.isPanning) {
      return
    }

    const dx = e.clientX - (panState.current.lastX || e.clientX)
    const dy = e.clientY - (panState.current.lastY || e.clientY)

    panState.current.lastX = e.clientX
    panState.current.lastY = e.clientY
    setTranslate((t) => limitTranslate({ x: t.x + dx, y: t.y + dy }))
  }

  function handlePointerEnd(e: React.PointerEvent<HTMLImageElement>) {
    if (e.pointerType === "touch") {
      return
    }

    panState.current = {}
  }

  function handleThumbnailWheel(e: React.WheelEvent<HTMLDivElement>) {
    const container = e.currentTarget
    const delta =
      Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY

    if (!delta) {
      return
    }

    const maxScrollLeft = container.scrollWidth - container.clientWidth

    if (maxScrollLeft <= 0) {
      return
    }

    const nextScrollLeft = clamp(
      container.scrollLeft + delta,
      0,
      maxScrollLeft
    )

    if (nextScrollLeft !== container.scrollLeft) {
      e.preventDefault()
      container.scrollLeft = nextScrollLeft
    }
  }

  function handleThumbnailsTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    thumbnailsDragState.current = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      scrollLeft: e.currentTarget.scrollLeft,
      moved: false
    }
  }

  function handleThumbnailsTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    const state = thumbnailsDragState.current

    if (
      state.startX == null ||
      state.startY == null ||
      state.scrollLeft == null
    ) {
      return
    }

    const dx = e.touches[0].clientX - state.startX
    const dy = e.touches[0].clientY - state.startY

    if (Math.abs(dx) <= Math.abs(dy)) {
      return
    }

    e.preventDefault()
    state.moved = Math.abs(dx) > 6
    e.currentTarget.scrollLeft = state.scrollLeft - dx
  }

  function handleThumbnailsTouchEnd() {
    window.setTimeout(() => {
      thumbnailsDragState.current = {}
    }, 0)
  }

  function preventThumbnailClickAfterDrag(
    e: React.MouseEvent<HTMLDivElement>
  ) {
    if (!thumbnailsDragState.current.moved) {
      return
    }

    e.preventDefault()
    e.stopPropagation()
  }

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const listener = (ev: WheelEvent) => handleWheel(ev as any)
    el.addEventListener("wheel", listener, { passive: false })
    return () => el.removeEventListener("wheel", listener)
  }, [containerRef, scale])

  function nextImage() {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  function previousImage() {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" motionPreset="none">
      <ModalOverlay bg="rgba(0,0,0,0.92)" backdropFilter="blur(10px)" />

      <ModalContent bg="transparent" boxShadow="none">
        <ModalBody p={0}>
          <Flex direction="column" h="100vh">
            <Flex
              ref={containerRef}
              flex={1}
              justify="center"
              align="center"
              position="relative"
              overflow="hidden"
            >
              <Flex
                position="absolute"
                top={6}
                right={6}
                zIndex={10}
                w="48px"
                h="48px"
                borderRadius="full"
                bg="rgba(255,255,255,0.08)"
                justify="center"
                align="center"
                cursor="pointer"
                transition="0.2s"
                _hover={{
                  bg: "rgba(255,255,255,0.14)"
                }}
                onClick={onClose}
              >
                <Icon as={FiX} fontSize="24px" color="white" />
              </Flex>

              <Flex
                position="absolute"
                left={6}
                top="50%"
                transform="
                  translateY(-50%)
                "
                zIndex={10}
                w="52px"
                h="52px"
                borderRadius="full"
                bg="rgba(255,255,255,0.08)"
                justify="center"
                align="center"
                cursor="pointer"
                transition="0.2s"
                _hover={{
                  bg: "rgba(255,255,255,0.14)"
                }}
                onClick={previousImage}
              >
                <Icon as={FiChevronLeft} fontSize="26px" color="white" />
              </Flex>

              <Flex
                position="absolute"
                right={6}
                top="50%"
                transform="
                  translateY(-50%)
                "
                zIndex={10}
                w="52px"
                h="52px"
                borderRadius="full"
                bg="rgba(255,255,255,0.08)"
                justify="center"
                align="center"
                cursor="pointer"
                transition="0.2s"
                _hover={{
                  bg: "rgba(255,255,255,0.14)"
                }}
                onClick={nextImage}
              >
                <Icon as={FiChevronRight} fontSize="26px" color="white" />
              </Flex>

              <AnimatePresence mode="wait">
                <MotionImage
                  ref={(el: HTMLImageElement | null) => {
                    imgRef.current = el
                  }}
                  key={images[selectedIndex]}
                  src={images[selectedIndex]}
                  maxW="92vw"
                  maxH="78vh"
                  objectFit="contain"
                  borderRadius="2xl"
                  userSelect="none"
                  draggable={false}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerEnd}
                  onPointerCancel={handlePointerEnd}
                  style={{
                    transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                    transformOrigin: "center center",
                    touchAction: "none",
                    cursor: scale > 1 ? "grab" : "zoom-in",
                    willChange: "transform"
                  }}
                  initial={{
                    opacity: 0
                  }}
                  animate={{
                    opacity: 1
                  }}
                  exit={{
                    opacity: 0
                  }}
                  transition={{
                    duration: 0.22
                  }}
                />
              </AnimatePresence>
            </Flex>

            <Box
              borderTop="
                1px solid
                rgba(255,255,255,0.08)
              "
              bg="rgba(0,0,0,0.45)"
              backdropFilter="blur(12px)"
              py={5}
            >
              <Flex
                ref={thumbnailsRef}
                px={6}
                gap={3}
                overflowX="auto"
                overflowY="hidden"
                onWheel={handleThumbnailWheel}
                onTouchStart={handleThumbnailsTouchStart}
                onTouchMove={handleThumbnailsTouchMove}
                onTouchEnd={handleThumbnailsTouchEnd}
                onClickCapture={preventThumbnailClickAfterDrag}
                css={{
                  WebkitOverflowScrolling: "touch",
                  overscrollBehaviorX: "contain",
                  overscrollBehaviorY: "none",
                  touchAction: "pan-x pinch-zoom",

                  "&::-webkit-scrollbar": {
                    height: "6px"
                  },

                  "&::-webkit-scrollbar-thumb": {
                    background: "rgba(255,255,255,0.18)",
                    borderRadius: "999px"
                  }
                }}
              >
                {images.map((image, index) => (
                  <Box
                    key={image}
                    w="120px"
                    h="84px"
                    borderRadius="xl"
                    overflow="hidden"
                    cursor="pointer"
                    flexShrink={0}
                    flexGrow={0}
                    border="2px solid"
                    borderColor={
                      selectedIndex === index ? "blue.400" : "transparent"
                    }
                    transition="0.2s"
                    _hover={{
                      opacity: 0.85
                    }}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <Image src={image} w="100%" h="100%" objectFit="cover" />
                  </Box>
                ))}
              </Flex>

              <HStack justify="center" mt={4}>
                <Text color="gray.400">{selectedIndex + 1}</Text>

                <Text color="gray.600">/</Text>

                <Text color="gray.400">{images.length}</Text>
              </HStack>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
