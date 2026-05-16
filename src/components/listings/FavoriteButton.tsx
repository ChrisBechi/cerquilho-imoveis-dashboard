import { IconButton } from "@chakra-ui/react"
import type { MouseEvent } from "react"
import { FaHeart } from "react-icons/fa"
import { FiHeart } from "react-icons/fi"

interface Props {
  isFavorite: boolean
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
}

export default function FavoriteButton({ isFavorite, onClick }: Props) {
  return (
    <IconButton
      aria-label="Favoritar"
      icon={isFavorite ? <FaHeart /> : <FiHeart />}
      color="red.400"
      size="sm"
      borderRadius="full"
      bg="transparent"
      _hover={{ transform: "scale(1.08)" }}
      onClick={onClick}
    />
  )
}
