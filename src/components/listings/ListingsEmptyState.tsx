import { type ReactNode } from "react"
import EmptyState from "../ui/EmptyState"

interface Props {
  title: string
  description: string
  buttonLabel?: string
  onButtonClick?: () => void
  icon?: ReactNode
}

export default function ListingsEmptyState(props: Props) {
  return <EmptyState {...props} />
}
