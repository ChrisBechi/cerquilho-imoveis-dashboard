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
                  key={images[selectedIndex]}
                  src={images[selectedIndex]}
                  maxW="92vw"
                  maxH="78vh"
                  objectFit="contain"
                  borderRadius="2xl"
                  userSelect="none"
                  draggable={false}
                  drag="x"
                  dragConstraints={{
                    left: 0,
                    right: 0
                  }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -80) {
                      nextImage()
                    }

                    if (info.offset.x > 80) {
                      previousImage()
                    }
                  }}
                  initial={{
                    opacity: 0,
                    x: 40
                  }}
                  animate={{
                    opacity: 1,
                    x: 0
                  }}
                  exit={{
                    opacity: 0,
                    x: -40
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
                css={{
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
                    minW="120px"
                    h="84px"
                    borderRadius="xl"
                    overflow="hidden"
                    cursor="pointer"
                    flexShrink={0}
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
