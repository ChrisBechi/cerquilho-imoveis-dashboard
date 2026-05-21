import StatCard from "./ui/StatCard"
import type { ReactNode } from "react"

interface Props {
  title: string

  value: string | number

  icon?: ReactNode
  isLoading?: boolean
  error?: string | Error | null
  onRetry?: () => void
  onClick?: () => void
}

export default function KpiCard({
  title,
  value,
  icon,
  isLoading,
  error,
  onRetry,
  onClick
}: Props) {
  return (
    <StatCard
      title={title}
      value={value}
      icon={icon}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      onClick={onClick}
      cursor={onClick ? "pointer" : "default"}
      transition="all 0.2s"
      _hover={onClick ? { borderColor: "brand.500", boxShadow: "md" } : {}}
    />
  )
}
