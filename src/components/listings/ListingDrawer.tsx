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
  Image,
  Link,
  Stack,
  Text,
  useDisclosure,
  useToast,
  Heading
} from "@chakra-ui/react"
import { AnimatePresence, motion } from "framer-motion"
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
import ImageLightbox from "../ImageLightbox"
import type { Listing } from "../../types/listing"
import { FaBath } from "react-icons/fa"
import useListingDetails from "../../hooks/useListingDetails"
import PriceHistoryChart from "../PriceHistoryChart"
import ListingTimeline from "../ListingTimeline"
import ListingInfoCard from "./ListingInfoCard"
import { Skeleton } from "@chakra-ui/react"

const MotionImage = motion(Image)

interface Props {
  isOpen: boolean
  onClose: () => void
  listing: Listing | null
}

export default function ListingDrawer({ isOpen, onClose, listing }: Props) {
  if (!listing) {
    return null
  }

  const images = useMemo(
    () => (listing.images?.length ? listing.images : [listing.thumbnail_url]),
    [listing]
  )
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedImage = images[selectedIndex]
  const thumbnailsRef = useRef<HTMLDivElement>(null)

  const {
    isOpen: isLightboxOpen,
    onOpen: onLightboxOpen,
    onClose: onLightboxClose
  } = useDisclosure()

  useEffect(() => {
    setSelectedIndex(0)
  }, [listing.id])

  const { data: details, isLoading: detailsLoading, error: detailsError, refetch: refetchDetails } = useListingDetails(listing.id)
  const toast = useToast()

  useEffect(() => {
    if (detailsError) {
      toast({ title: "Erro ao carregar detalhes do imóvel", status: "error", duration: 5000, isClosable: true })
    }
  }, [detailsError, toast])

  useEffect(() => {
    const container = thumbnailsRef.current
    if (!container) return

    const activeThumb = container.children[selectedIndex] as HTMLElement
    activeThumb?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest"
    })
  }, [selectedIndex])

  function nextImage() {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  function previousImage() {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody p={0}>
            <Box position="relative">
              <AnimatePresence mode="wait">
                <MotionImage
                  key={selectedImage}
                  src={selectedImage}
                  alt={listing.title}
                  h="340px"
                  w="100%"
                  objectFit="cover"
                  cursor="zoom-in"
                  onDoubleClick={onLightboxOpen}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ pointerEvents: "auto" }}
                />
              </AnimatePresence>

              <Flex
                position="absolute"
                inset={0}
                pointerEvents="none"
                bgGradient="linear(to-t, rgba(0,0,0,0.85), transparent)"
              />

              <Flex
                position="absolute"
                top={5}
                right={5}
                w="42px"
                h="42px"
                borderRadius="full"
                bg="glass"
                justify="center"
                align="center"
                cursor="pointer"
                transition="0.2s"
                _hover={{ bg: "glassHover" }}
                onClick={onClose}
              >
                <FiX />
              </Flex>

              <Flex
                position="absolute"
                left={4}
                top="50%"
                transform="translateY(-50%)"
                w="42px"
                h="42px"
                borderRadius="full"
                bg="glass"
                justify="center"
                align="center"
                cursor="pointer"
                transition="0.2s"
                _hover={{ bg: "glassHover" }}
                onClick={previousImage}
              >
                <FiChevronLeft />
              </Flex>

              <Flex
                position="absolute"
                right={4}
                top="50%"
                transform="translateY(-50%)"
                w="42px"
                h="42px"
                borderRadius="full"
                bg="glass"
                justify="center"
                align="center"
                cursor="pointer"
                transition="0.2s"
                _hover={{ bg: "glassHover" }}
                onClick={nextImage}
              >
                <FiChevronRight />
              </Flex>

              <Stack position="absolute" bottom={6} left={6} spacing={3}>
                <HStack>
                  {listing.is_new && (
                    <Badge
                      colorScheme="green"
                      borderRadius="full"
                      px={3}
                      py={1}
                    >
                      NOVO
                    </Badge>
                  )}
                  {listing.is_reduced && (
                    <Badge colorScheme="red" borderRadius="full" px={3} py={1}>
                      REDUZIU
                    </Badge>
                  )}
                  {listing.is_rented && (
                    <Badge
                      colorScheme="purple"
                      borderRadius="full"
                      px={3}
                      py={1}
                    >
                      ALUGADO
                    </Badge>
                  )}
                </HStack>
                <Text
                  fontSize="3xl"
                  fontWeight="bold"
                  color="white"
                  lineHeight="1"
                >
                  {listing.price}
                </Text>
              </Stack>
            </Box>

            <Flex
              ref={thumbnailsRef}
              px={6}
              pt={5}
              pb={2}
              gap={3}
              overflowX="auto"
              overflowY="hidden"
              scrollSnapType="x mandatory"
              css={{
                "&::-webkit-scrollbar": { height: "6px" },
                "&::-webkit-scrollbar-thumb": {
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "999px"
                }
              }}
            >
              {images.map((image, index) => (
                <Box
                  key={image}
                  minW="95px"
                  h="72px"
                  borderRadius="xl"
                  overflow="hidden"
                  cursor="pointer"
                  border="2px solid"
                  borderColor={
                    selectedIndex === index ? "brand.400" : "transparent"
                  }
                  transition="0.2s"
                  flexShrink={0}
                  scrollSnapAlign="start"
                  position="relative"
                  _hover={{ opacity: 0.88 }}
                  onClick={() => setSelectedIndex(index)}
                >
                  <Image src={image} w="100%" h="100%" objectFit="cover" />
                  {selectedIndex === index && (
                    <Box
                      position="absolute"
                      inset={0}
                      border="2px solid"
                      borderColor="brand.400"
                      borderRadius="xl"
                      pointerEvents="none"
                    />
                  )}
                </Box>
              ))}
            </Flex>

            <Stack p={7} spacing={7}>
              <Box>
                <Text fontSize="2xl" fontWeight="bold" mb={3}>
                  {listing.title}
                </Text>
                <HStack color="gray.400" spacing={2}>
                  <Icon as={FiMapPin} />
                  <Text>{listing.neighborhood}</Text>
                </HStack>
              </Box>

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

              <Box bg="glass" borderRadius="2xl" p={5}>
                <Text color="gray.400" fontSize="sm" mb={2}>
                  Imobiliária
                </Text>
                <Text fontWeight="bold" fontSize="lg">
                  {listing.provider}
                </Text>
              </Box>

              {detailsLoading ? (
                <>
                  <Skeleton height="220px" borderRadius="xl" />
                  <Skeleton height="16px" mt={4} w="40%" />
                </>
              ) : detailsError ? (
                <Box bg="surfaceSecondary" borderRadius="2xl" p={4} border="1px solid" borderColor="border">
                  <Heading size="sm" mb={2}>Erro ao carregar dados</Heading>
                  <Text color="gray.400" mb={3}>{String(detailsError)}</Text>
                  <Button onClick={() => refetchDetails()}>Tentar novamente</Button>
                </Box>
              ) : (
                (() => {
                  const price_history = details?.price_history ?? []
                  const timeline = details?.timeline ?? []

                  return (
                    <>
                      {price_history && price_history.length > 1 && (
                        <PriceHistoryChart data={price_history} />
                      )}
                      {timeline && timeline.length > 0 && (
                        <ListingTimeline items={timeline} />
                      )}
                    </>
                  )
                })()
              )}

              {listing.is_reduced && listing.old_price && (
                <Box
                  bg="rgba(255,0,0,0.08)"
                  border="1px solid rgba(255,0,0,0.18)"
                  borderRadius="2xl"
                  p={5}
                >
                  <Text color="gray.400" fontSize="sm" mb={2}>
                    Preço anterior
                  </Text>
                  <Flex justify="space-between" align="center">
                    <Text textDecoration="line-through" color="red.300">
                      {listing.old_price}
                    </Text>
                    <Badge
                      colorScheme="green"
                      borderRadius="full"
                      px={3}
                      py={1}
                    >
                      {listing.price_difference}
                    </Badge>
                  </Flex>
                </Box>
              )}

              <Link
                href={listing.url}
                isExternal
                _hover={{ textDecoration: "none" }}
              >
                <Button
                  w="100%"
                  size="lg"
                  colorScheme="blue"
                  borderRadius="xl"
                  rightIcon={<FiExternalLink />}
                >
                  Abrir anúncio
                </Button>
              </Link>
            </Stack>
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
