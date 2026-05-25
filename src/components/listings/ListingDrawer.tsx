import {
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Link,
  Stack,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useDisclosure,
  useToast,
  Heading,
  VStack,
  Skeleton
} from "@chakra-ui/react"

import { AnimatePresence, motion } from "framer-motion"
import { MdOutlineRealEstateAgent } from "react-icons/md"

import { useEffect, useMemo, useRef, useState } from "react"

import {
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
  FiHome,
  FiMapPin,
  FiX
} from "react-icons/fi"

import { TbRulerMeasure } from "react-icons/tb"

import type { Listing } from "../../types/listing"

import { FaBath, FaWhatsapp } from "react-icons/fa"

import ImageLightbox from "../ImageLightbox"

import useListingDetails from "../../hooks/useListingDetails"

import PriceHistoryChart from "../PriceHistoryChart"

import ListingTimeline from "../ListingTimeline"

import ListingInfoCard from "./ListingInfoCard"

const MotionImage = motion(Image)

function generateWhatsAppUrl(listing: Listing): string {
  if (!listing.contact) return ""

  const message = `Olá, fiquei interessado no imóvel ${listing.code ? `com o código '${listing.code}'` : ""} e gostaria de agendar uma visita. Pode ser para o primeiro horário que tiver disponível.`
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/55${listing.contact}?text=${encodedMessage}`
}

function getGoogleMapsEmbedUrl(location: string) {
  if (location.includes("google.com/maps/embed")) {
    return location
  }

  try {
    const url = new URL(location)

    if (url.pathname.startsWith("/maps/embed")) {
      return location
    }

    if (url.pathname.startsWith("/maps")) {
      url.pathname = "/maps/embed"
      if (!url.searchParams.has("output")) {
        url.searchParams.set("output", "embed")
      }
      return url.toString()
    }
  } catch {
    return location
  }

  return location
}

interface Props {
  isOpen: boolean

  onClose: () => void

  listing: Listing | null
}

export default function ListingDrawer({ isOpen, onClose, listing }: Props) {
  const images = useMemo(
    () =>
      listing?.images?.length ? listing.images : [listing?.thumbnail_url || ""],
    [listing]
  )

  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectedImage = images[selectedIndex]
  const hasMultipleImages = images.length > 1

  const thumbnailsRef = useRef<HTMLDivElement>(null)

  const {
    isOpen: isLightboxOpen,

    onOpen: onLightboxOpen,

    onClose: onLightboxClose
  } = useDisclosure()

  const {
    data: details,

    isLoading: detailsLoading,

    error: detailsError,

    refetch: refetchDetails
  } = useListingDetails(listing?.id || 0)

  const toast = useToast()

  useEffect(() => {
    setSelectedIndex(0)
  }, [listing?.id])

  useEffect(() => {
    if (isOpen) {
      // Incrementar contador de drawers abertos
      const count =
        parseInt(document.body.getAttribute("data-drawer-count") || "0") + 1
      document.body.setAttribute("data-drawer-count", count.toString())
      document.body.style.overflow = "hidden"
    } else {
      // Decrementar contador de drawers abertos
      const count = Math.max(
        0,
        parseInt(document.body.getAttribute("data-drawer-count") || "1") - 1
      )
      document.body.setAttribute("data-drawer-count", count.toString())

      // Apenas restaurar scroll se não há mais drawers abertos
      if (count === 0) {
        document.body.style.overflow = "unset"
      }
    }

    return () => {
      const count = Math.max(
        0,
        parseInt(document.body.getAttribute("data-drawer-count") || "1") - 1
      )
      document.body.setAttribute("data-drawer-count", count.toString())

      if (count === 0) {
        document.body.style.overflow = "unset"
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (detailsError) {
      toast({
        title: "Erro ao carregar detalhes do imóvel",

        status: "error",

        duration: 5000,

        isClosable: true
      })
    }
  }, [detailsError, toast])

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

  if (!listing) {
    return null
  }

  function nextImage() {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  function previousImage() {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  function handleImageDragEnd(
    _: MouseEvent | TouchEvent | PointerEvent,

    info: {
      offset: {
        x: number
      }
    }
  ) {
    const threshold = 80

    if (info.offset.x > threshold) {
      previousImage()
    } else if (info.offset.x < -threshold) {
      nextImage()
    }
  }

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        size="md"
        blockScrollOnMount
      >
        <DrawerOverlay />

        <DrawerContent bg="#050816">
          <DrawerBody p={0}>
            <VStack spacing={0} align="stretch" bg="#050816">
              {/* HERO IMAGE */}

              <Box
                position="relative"
                w="100%"
                h={{
                  base: "350px",
                  md: "320px"
                }}
                overflow="hidden"
                bg="black"
              >
                <AnimatePresence mode="wait">
                  <MotionImage
                    key={selectedImage}
                    src={selectedImage}
                    alt={listing.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    display="block"
                    cursor="zoom-in"
                    onDoubleClick={onLightboxOpen}
                    drag={hasMultipleImages ? "x" : undefined}
                    dragConstraints={
                      hasMultipleImages
                        ? {
                            left: 0,
                            right: 0
                          }
                        : undefined
                    }
                    dragElastic={hasMultipleImages ? 0.16 : undefined}
                    onDragEnd={
                      hasMultipleImages ? handleImageDragEnd : undefined
                    }
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
                      duration: 0.25
                    }}
                    style={{
                      pointerEvents: "auto"
                    }}
                  />
                </AnimatePresence>

                {/* BADGES */}

                <HStack
                  position="absolute"
                  top={5}
                  left={5}
                  spacing={2}
                  zIndex={3}
                >
                  {listing.is_new && (
                    <Badge
                      borderRadius="full"
                      px={4}
                      py={1.5}
                      bg="brand.400"
                      color="white"
                      fontSize="xs"
                    >
                      NOVO
                    </Badge>
                  )}

                  {listing.is_reduced && (
                    <Badge
                      borderRadius="full"
                      px={4}
                      py={1.5}
                      bg="red.500"
                      color="white"
                      fontSize="xs"
                    >
                      REDUZIU
                    </Badge>
                  )}

                  {listing.is_rented && (
                    <Badge
                      borderRadius="full"
                      px={4}
                      py={1.5}
                      bg="purple.500"
                      color="white"
                      fontSize="xs"
                    >
                      ALUGADO
                    </Badge>
                  )}
                </HStack>

                {/* CLOSE */}

                <IconButton
                  aria-label="Fechar"
                  icon={<FiX />}
                  position="absolute"
                  top={5}
                  right={5}
                  borderRadius="full"
                  size="lg"
                  bg="blackAlpha.500"
                  color="white"
                  zIndex={3}
                  _hover={{
                    bg: "blackAlpha.700"
                  }}
                  onClick={onClose}
                />

                {/* PREVIOUS */}
                {hasMultipleImages && (
                  <IconButton
                    aria-label="Imagem anterior"
                    icon={<FiChevronLeft />}
                    position="absolute"
                    left={4}
                    top="50%"
                    transform="translateY(-50%)"
                    borderRadius="full"
                    bg="blackAlpha.600"
                    color="white"
                    zIndex={3}
                    _hover={{
                      bg: "blackAlpha.700"
                    }}
                    onClick={previousImage}
                  />
                )}

                {/* NEXT */}
                {hasMultipleImages && (
                  <IconButton
                    aria-label="Próxima imagem"
                    icon={<FiChevronRight />}
                    position="absolute"
                    right={4}
                    top="50%"
                    transform="translateY(-50%)"
                    borderRadius="full"
                    bg="blackAlpha.600"
                    color="white"
                    zIndex={3}
                    _hover={{
                      bg: "blackAlpha.700"
                    }}
                    onClick={nextImage}
                  />
                )}

                <Box
                  position="absolute"
                  left={5}
                  bottom={5}
                  px={4}
                  py={1}
                  borderRadius="xl"
                  bg="blackAlpha.600"
                  zIndex={3}
                >
                  <Text color="white" fontWeight="bold" fontSize="sm">
                    {selectedIndex + 1}/{images.length}
                  </Text>
                </Box>

                {/* PRICE */}

                <Box
                  position="absolute"
                  right={5}
                  bottom={5}
                  px={5}
                  py={3}
                  borderRadius="2xl"
                  bg="rgba(0,0,0,0.72)"
                  backdropFilter="blur(12px)"
                  zIndex={3}
                  maxW="85%"
                >
                  <Text
                    color="white"
                    fontWeight="black"
                    lineHeight="1"
                    fontSize={{
                      base: "2xl",
                      md: "xl"
                    }}
                  >
                    {listing.price}
                  </Text>
                </Box>
              </Box>

              {/* THUMBNAILS */}

              <Box position="relative" zIndex={2} bg="#050816">
                <HStack
                  ref={thumbnailsRef}
                  px={5}
                  py={4}
                  spacing={3}
                  overflowX="auto"
                  overflowY="hidden"
                  align="stretch"
                  minH="92px"
                  css={{
                    WebkitOverflowScrolling: "touch",

                    "&::-webkit-scrollbar": {
                      height: "5px"
                    },

                    "&::-webkit-scrollbar-thumb": {
                      background: "rgba(255,255,255,0.12)",

                      borderRadius: "999px"
                    }
                  }}
                >
                  {images.map((image, index) => (
                    <Box
                      key={image}
                      minW="110px"
                      w="110px"
                      h="82px"
                      borderRadius="sm"
                      overflow="hidden"
                      cursor="pointer"
                      flexShrink={0}
                      position="relative"
                      border="2px solid"
                      borderColor={
                        selectedIndex === index ? "brand.400" : "whiteAlpha.100"
                      }
                      transition="0.2s"
                      bg="gray.800"
                      onClick={() => setSelectedIndex(index)}
                    >
                      <Image
                        src={image}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        display="block"
                      />

                      {selectedIndex === index && (
                        <Box
                          position="absolute"
                          inset={0}
                          bg="
                              rgba(
                                59,
                                130,
                                246,
                                0.18
                              )
                            "
                          pointerEvents="none"
                        />
                      )}
                    </Box>
                  ))}
                </HStack>
              </Box>

              {/* CONTENT */}

              <Stack px={7} pt={7} pb={12} spacing={7}>
                {/* TITLE */}

                <Box>
                  <Text
                    fontSize="2xl"
                    fontWeight="black"
                    lineHeight="1.4"
                    mb={3}
                  >
                    {listing.title}
                  </Text>

                  {listing.neighborhood && (
                    <HStack color="gray.400" spacing={2}>
                      <Icon as={FiMapPin} />

                      <Text>{listing.neighborhood}</Text>
                    </HStack>
                  )}
                </Box>

                {/* INFO CARDS */}

                <Flex gap={4} flexWrap="wrap">
                  <ListingInfoCard
                    icon={FiHome}
                    label="Quartos"
                    value={listing.bedrooms}
                  />

                  <ListingInfoCard
                    icon={FaBath}
                    label="Banheiros"
                    value={listing.bathrooms}
                  />

                  <ListingInfoCard
                    icon={TbRulerMeasure}
                    label="Área"
                    value={`${listing.area}m²`}
                  />
                </Flex>

                {/* PROVIDER */}

                <Flex
                  gap={4}
                  bg="glass"
                  align="center"
                  borderRadius="2xl"
                  w="100%"
                  pl={6}
                >
                  <IconButton
                    aria-label="Imobiliária"
                    icon={<MdOutlineRealEstateAgent size="25px" />}
                    color="white"
                    size="md"
                    borderRadius="0"
                    border="0"
                    background="transparent"
                  />
                  <Box w="100%" p={5} pl={1}>
                    <Text color="gray.400" fontSize="sm" mb={1}>
                      Imobiliária
                    </Text>

                    <Text fontWeight="bold" fontSize="lg">
                      {listing.provider}
                    </Text>
                  </Box>
                </Flex>

                {listing.location && (
                  <Box
                    bg="surfaceSecondary"
                    borderRadius="2xl"
                    border="1px solid"
                    borderColor="border"
                    overflow="hidden"
                  >
                    <Box px={6} py={5} bg="glass">
                      <HStack spacing={3} alignItems="center">
                        <Icon as={FiMapPin} boxSize={6} color="red.400" />
                        <Box>
                          <Text fontWeight="bold" fontSize="md">
                            Localização
                          </Text>
                          <Text color="gray.400" fontSize="sm">
                            Link do Google Maps
                          </Text>
                        </Box>
                      </HStack>
                    </Box>

                    <Box
                      as="iframe"
                      src={getGoogleMapsEmbedUrl(listing.location)}
                      w="100%"
                      h={{ base: "260px", md: "320px" }}
                      border={0}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </Box>
                )}

                {/* DETAILS */}

                {detailsLoading ? (
                  <>
                    <Skeleton height="220px" borderRadius="xl" />

                    <Skeleton height="16px" mt={4} w="40%" />
                  </>
                ) : detailsError ? (
                  <Box
                    bg="surfaceSecondary"
                    borderRadius="2xl"
                    p={4}
                    border="1px solid"
                    borderColor="border"
                  >
                    <Heading size="sm" mb={2}>
                      Erro ao carregar dados
                    </Heading>

                    <Text color="gray.400" mb={3}>
                      {String(detailsError)}
                    </Text>

                    <Button onClick={() => refetchDetails()}>
                      Tentar novamente
                    </Button>
                  </Box>
                ) : (
                  (() => {
                    const price_history = details?.price_history ?? []

                    const timeline = details?.timeline ?? []

                    return (
                      <>
                        {price_history.length > 1 && (
                          <PriceHistoryChart data={price_history} />
                        )}

                        {timeline.length > 0 && (
                          <ListingTimeline items={timeline} />
                        )}
                      </>
                    )
                  })()
                )}

                {/* PRICE REDUCTION */}

                {listing.is_reduced && (
                  <Flex
                    justify="space-between"
                    align="center"
                    bg="linear-gradient(135deg, rgba(255,0,0,0.10), rgba(255,80,80,0.04))"
                    border="1px solid rgba(255,80,80,0.25)"
                    borderRadius="2xl"
                    p={4}
                    position="relative"
                    overflow="hidden"
                  >
                    <Box
                      position="absolute"
                      top="-30px"
                      right="-30px"
                      w="80px"
                      h="80px"
                      bg="red.500"
                      opacity={0.08}
                      borderRadius="full"
                      filter="blur(20px)"
                    />

                    <Stack spacing={2} zIndex={1} flex={1}>
                      <Text
                        color="gray.400"
                        fontSize="xs"
                        textTransform="uppercase"
                        letterSpacing="1px"
                        fontWeight="bold"
                      >
                        Preço reduzido
                      </Text>

                      {listing.old_price ? (
                        <Flex gap={4} align="flex-end" wrap="wrap">
                          <Stack spacing={0} flex="1" minW="130px">
                            <Text color="gray.400" fontSize="xs">
                              Antes
                            </Text>
                            <Text
                              textDecoration="line-through"
                              color="red.300"
                              fontSize="md"
                              fontWeight="semibold"
                            >
                              {listing.old_price}
                            </Text>
                          </Stack>

                          <Stack spacing={0} flex="1" minW="130px">
                            <Text color="gray.400" fontSize="sm">
                              Agora
                            </Text>
                            <Text
                              color="white"
                              fontSize="2xl"
                              fontWeight="extrabold"
                              lineHeight="1"
                            >
                              R${" "}
                              {listing.price_numeric.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </Text>
                          </Stack>
                        </Flex>
                      ) : (
                        <Text color="gray.300" fontSize="sm">
                          Preço com redução aplicada
                        </Text>
                      )}
                    </Stack>

                    <Stat textAlign="right" minW="120px" zIndex={1}>
                      <StatLabel color="gray.400" fontSize="sm">
                        Economia
                      </StatLabel>
                      <StatNumber
                        color="green.300"
                        fontSize="2xl"
                        fontWeight="bold"
                      >
                        {listing.price_difference ?? "--"}
                      </StatNumber>
                      {listing.price_drop_percentage != null ? (
                        <StatHelpText color="green.300" fontSize="md">
                          <StatArrow type="decrease" />
                          {listing.price_drop_percentage}%
                        </StatHelpText>
                      ) : null}
                    </Stat>
                  </Flex>
                )}

                {/* BUTTON */}

                <Stack spacing={3} w="100%">
                  <Link
                    href={listing.url}
                    isExternal
                    _hover={{
                      textDecoration: "none"
                    }}
                    flex={1}
                  >
                    <Button
                      w="100%"
                      size="lg"
                      colorScheme="blue"
                      variant="solid"
                      borderRadius="xl"
                      rightIcon={<FiExternalLink />}
                    >
                      Abrir anúncio
                    </Button>
                  </Link>
                  {listing.contact && (
                    <Link
                      href={generateWhatsAppUrl(listing)}
                      isExternal
                      _hover={{ textDecoration: "none" }}
                      flex={1}
                    >
                      <Button
                        w="100%"
                        size="lg"
                        bg="#25D366"
                        color="white"
                        borderRadius="xl"
                        rightIcon={<FaWhatsapp />}
                        _hover={{ bg: "#1ebc5f" }}
                      >
                        Agendar visita
                      </Button>
                    </Link>
                  )}
                </Stack>
              </Stack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <ImageLightbox
        isOpen={isLightboxOpen}
        onClose={onLightboxClose}
        images={images}
        initialIndex={selectedIndex}
      />
    </>
  )
}
