import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Link,
  Skeleton,
  Stack,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useDisclosure
} from "@chakra-ui/react"
import { memo, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FiExternalLink,
  FiHeart,
  FiHome,
  FiMapPin,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi"
import { TbRulerMeasure } from "react-icons/tb"
import { FaBath, FaHeart } from "react-icons/fa"
import type { Listing } from "../../types/listing"
import ListingDrawer from "./ListingDrawer"

const MotionBox = motion(Box)
const MotionImage = motion(Image)

interface Props {
  listing: Listing
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  isLoading?: boolean
}

function ListingStatusBadges({ listing }: { listing: Listing }) {
  return (
    <HStack spacing={2} flexWrap="wrap">
      {listing.is_new && (
        <Badge
          px={3}
          py={1}
          borderRadius="full"
          fontSize="0.72rem"
          bg="rgba(34, 122, 238, 0.8)"
          color="white"
        >
          NOVO
        </Badge>
      )}

      {listing.is_reduced && (
        <Badge
          px={3}
          py={1}
          borderRadius="full"
          fontSize="0.72rem"
          bg="rgba(239,68,68,0.8)"
          color="white"
        >
          ↓ REDUZIU
        </Badge>
      )}

      {listing.is_rented && (
        <Badge
          px={3}
          py={1}
          borderRadius="full"
          fontSize="0.72rem"
          bg="rgba(168,85,247,0.8)"
          color="white"
        >
          ALUGADO
        </Badge>
      )}
    </HStack>
  )
}

function ListingSpecs({ listing }: { listing: Listing }) {
  return (
    <Flex gap={1} flexWrap="wrap" color="gray.300" fontSize="sm">
      <Flex align="center" gap={2} bg="glass" px={3} py={2} borderRadius="xl">
        <FiHome />
        {listing.bedrooms} quartos
      </Flex>

      <Flex align="center" gap={2} bg="glass" px={3} py={2} borderRadius="xl">
        <FaBath />
        {listing.bathrooms} banheiros
      </Flex>

      <Flex align="center" gap={2} bg="glass" px={3} py={2} borderRadius="xl">
        <TbRulerMeasure />
        {listing.area}m²
      </Flex>
    </Flex>
  )
}

function ListingReducedSection({ listing }: { listing: Listing }) {
  if (!listing.is_reduced) {
    return null
  }

  return (
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
                Antes:
                <Text
                  textDecoration="line-through"
                  color="red.200"
                  fontSize="sm"
                  fontWeight="semibold"
                  as="span"
                  ml={2}
                >
                  {listing.old_price}
                </Text>
              </Text>
            </Stack>

            <Stack spacing={0} flex="1" minW="130px">
              <Text color="gray.400" fontSize="xs">
                Agora
              </Text>
              <Text
                color="white"
                fontSize="xl"
                fontWeight="extrabold"
                lineHeight="1"
              >
                R$ {listing.price}
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
        <StatLabel color="gray.400" fontSize="xs">
          Economia
        </StatLabel>
        <StatNumber color="green.300" fontSize="lg" fontWeight="bold">
          {listing.price_difference ?? "--"}
        </StatNumber>
        {listing.price_drop_percentage != null ? (
          <StatHelpText color="green.300" fontSize="xs">
            <StatArrow type="decrease" />
            {listing.price_drop_percentage}%
          </StatHelpText>
        ) : null}
      </Stat>
    </Flex>
  )
}

function ListingCard({
  listing,
  isFavorite,
  onToggleFavorite,
  isLoading
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedIndex, setSelectedIndex] = useState(0)

  const images = useMemo(
    () =>
      listing?.images?.length ? listing.images : [listing?.thumbnail_url || ""],
    [listing]
  )

  const selectedImage = images[selectedIndex]
  const hasMultipleImages = images.length > 1

  const nextImage = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const previousImage = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleImageDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: {
      offset: {
        x: number
      }
    }
  ) => {
    if (!hasMultipleImages) {
      return
    }

    const threshold = 50

    if (info.offset.x > threshold) {
      previousImage()
    } else if (info.offset.x < -threshold) {
      nextImage()
    }
  }

  if (isLoading) {
    return (
      <Box
        bg="#181c25"
        borderRadius="3xl"
        display="flex"
        flexDirection="column"
        h="100%"
        overflow="hidden"
        border="1px solid"
        borderColor="whiteAlpha.100"
      >
        <Skeleton h="240px" />

        <Stack p={5} spacing={4}>
          <Skeleton h="22px" />
          <Skeleton h="18px" w="120px" />
          <HStack>
            <Skeleton h="24px" w="70px" borderRadius="full" />
            <Skeleton h="24px" w="90px" borderRadius="full" />
          </HStack>
          <Skeleton h="18px" />
          <Skeleton h="40px" borderRadius="xl" />
        </Stack>
      </Box>
    )
  }

  return (
    <>
      <MotionBox
        cursor="pointer"
        onClick={onOpen}
        initial={false}
        animate={false}
        transition={{ duration: 0.25 }}
        display="flex"
        flexDirection="column"
        h="100%"
        bg="surfaceSecondary"
        borderRadius="2xl"
        overflow="hidden"
        border="1px solid"
        borderColor="border"
        position="relative"
        whileHover={{ y: -4 }}
        _hover={{
          borderColor: "borderStrong",
          boxShadow: "soft"
        }}
      >
        <Box position="relative" overflow="hidden">
          <AnimatePresence mode="wait">
            <MotionImage
              key={selectedImage}
              src={`${selectedImage}?w=800&q=80`}
              alt={listing.title}
              h="240px"
              w="100%"
              objectFit="cover"
              cursor={hasMultipleImages ? "grab" : "default"}
              _active={hasMultipleImages ? { cursor: "grabbing" } : undefined}
              drag={hasMultipleImages ? "x" : undefined}
              dragConstraints={
                hasMultipleImages ? { left: 0, right: 0 } : undefined
              }
              dragElastic={hasMultipleImages ? 0.16 : undefined}
              onDragEnd={handleImageDragEnd}
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
            />
          </AnimatePresence>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation()
                  previousImage()
                }}
                aria-label="Foto anterior"
                icon={<FiChevronLeft />}
                position="absolute"
                left={2}
                top="50%"
                transform="translateY(-50%)"
                bg="blackAlpha.600"
                color="white"
                borderRadius="sm"
                size="sm"
                _hover={{ bg: "blackAlpha.800" }}
                zIndex={2}
              />
              <IconButton
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                aria-label="Próxima foto"
                icon={<FiChevronRight />}
                position="absolute"
                right={2}
                top="50%"
                transform="translateY(-50%)"
                bg="blackAlpha.600"
                color="white"
                borderRadius="sm"
                size="sm"
                _hover={{ bg: "blackAlpha.800" }}
                zIndex={2}
              />
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <Box
              position="absolute"
              bottom={3}
              left={2}
              bg="blackAlpha.600"
              px={3}
              py={1}
              borderRadius="md"
            >
              <Text color="white" fontWeight="bold" fontSize="xs">
                {selectedIndex + 1}/{images.length}
              </Text>
            </Box>
          )}

          {/* Status Badges */}
          <HStack
            position="absolute"
            top={3}
            left={3}
            spacing={2}
            flexWrap="wrap"
          >
            <ListingStatusBadges listing={listing} />
          </HStack>

          {/* Favorite Button */}
          <IconButton
            onClick={(event) => {
              event.stopPropagation()
              onToggleFavorite(listing.id.toString())
            }}
            aria-label="Favoritar"
            icon={isFavorite ? <FaHeart /> : <FiHeart />}
            color="danger"
            size="sm"
            borderRadius="full"
            position="absolute"
            right={3}
            top={3}
            bg="blackAlpha.600"
            _hover={{
              transform: "scale(1.08)",
              bg: "glassHover"
            }}
          />

          <Box
            position="absolute"
            bottom={3}
            right={2}
            bg="blackAlpha.600"
            px={4}
            py={1}
            borderRadius="xl"
          >
            <Text color="white" fontWeight="bold" fontSize="lg">
              {listing.price}
            </Text>
          </Box>
        </Box>

        <Stack p={5} spacing={4} flex={1}>
          <Stack spacing={0}>
            <Text
              fontSize="xl"
              fontWeight="bold"
              lineHeight="1.2"
              noOfLines={2}
            >
              {listing.title}
            </Text>

            {listing.neighborhood && (
              <HStack color="gray.400" spacing={2} fontSize="sm">
                <Icon as={FiMapPin} />
                <Text>{listing.neighborhood}</Text>
              </HStack>
            )}

            <Text color="gray.500" fontSize="sm">
              {listing.provider}
            </Text>
          </Stack>

          <ListingSpecs listing={listing} />
          <ListingReducedSection listing={listing} />

          {!listing.is_rented && (
            <Link
              mt="auto"
              onClick={(event) => event.stopPropagation()}
              href={listing.url}
              isExternal
              _hover={{ textDecoration: "none" }}
            >
              <Button
                w="100%"
                size="lg"
                variant="solid"
                colorScheme="blue"
                borderRadius="xl"
                rightIcon={<FiExternalLink />}
                transition="0.2s"
                _hover={{ transform: "translateY(-2px)" }}
              >
                Ver imóvel
              </Button>
            </Link>
          )}
        </Stack>
      </MotionBox>

      <ListingDrawer isOpen={isOpen} onClose={onClose} listing={listing} />
    </>
  )
}

export default memo(ListingCard)
