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
  Text,
  useDisclosure
} from "@chakra-ui/react"
import { memo } from "react"
import { motion } from "framer-motion"
import { FiExternalLink, FiHeart, FiHome, FiMapPin } from "react-icons/fi"
import { TbRulerMeasure } from "react-icons/tb"
import { FaBath, FaHeart } from "react-icons/fa"
import type { Listing } from "../../types/listing"
import ListingDrawer from "./ListingDrawer"

const MotionBox = motion(Box)

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
  if (!listing.is_reduced || !listing.old_price) {
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

      <Stack spacing={1} zIndex={1}>
        <Text
          color="gray.400"
          fontSize="xs"
          textTransform="uppercase"
          letterSpacing="1px"
          fontWeight="bold"
        >
          Preço anterior
        </Text>

        <Text
          textDecoration="line-through"
          color="red.200"
          fontSize="lg"
          fontWeight="medium"
        >
          {listing.old_price}
        </Text>
      </Stack>

      <Stack spacing={2} align="end" zIndex={1}>
        <Badge
          borderRadius="full"
          px={2}
          py={0}
          fontSize="0.6rem"
          bg="rgba(34,197,94)"
          color="white"
        >
          ECONOMIA
        </Badge>

        <Text color="green.300" fontWeight="bold" fontSize="2xl" lineHeight="1">
          {listing.price_difference}
        </Text>
      </Stack>
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
          <Image
            src={`${listing.thumbnail_url}?w=800&q=80`}
            alt={listing.title}
            h="240px"
            w="100%"
            objectFit="cover"
            transition="0.4s"
            loading="lazy"
            _hover={{ opacity: 0.92 }}
          />

          <Flex
            position="absolute"
            inset={0}
            bgGradient="linear(to-t, rgba(0,0,0,0.75), transparent)"
          />

          <Flex
            position="absolute"
            inset={0}
            justify="space-between"
            align="start"
            top={4}
            left={4}
          >
            <HStack spacing={2} flexWrap="wrap">
              <ListingStatusBadges listing={listing} />
            </HStack>

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
              top={-1}
              bg="blackAlpha.600"
              _hover={{ transform: "scale(1.08)", bg: "glassHover" }}
            />
          </Flex>

          <Box
            position="absolute"
            bottom={3}
            right={2}
            bg="blackAlpha.600"
            px={4}
            py={2}
            borderRadius="xl"
          >
            <Text color="white" fontWeight="bold" fontSize="xl">
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

            <HStack color="gray.400" spacing={2} fontSize="sm">
              <Icon as={FiMapPin} />
              <Text>{listing.neighborhood}</Text>
            </HStack>

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
