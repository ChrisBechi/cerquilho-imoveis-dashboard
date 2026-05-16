import ActionButton from "../ui/ActionButton"
import type { ReactNode } from "react"

interface Props {
  onClick: () => void
  label?: string
  children?: ReactNode
}

export default function LoadMoreButton({
  onClick,
  label = "Carregar mais imóveis",
  children
}: Props) {
  return (
    <ActionButton
      onClick={onClick}
      label={children ?? label}
      variant="secondary"
      px={8}
      h="42px"
    />
  )
}
