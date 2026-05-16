export function centsToBRL(cents: number) {
  const value = cents / 100
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

export function formatPercentage(value: number) {
  return `${(value * 100).toFixed(0)}%`
}
