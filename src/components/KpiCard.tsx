import StatCard from "./ui/StatCard"
import type { ReactNode } from "react"

interface Props {
  title: string

  value: string | number

  icon?: ReactNode
  isLoading?: boolean
  error?: string | Error | null
  onRetry?: () => void
}

export default function KpiCard({
  title,
  value,
  icon,
  isLoading,
  error,
  onRetry
}: Props) {
  return (
    <StatCard
      title={title}
      value={value}
      icon={icon}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
    />
  )
}
