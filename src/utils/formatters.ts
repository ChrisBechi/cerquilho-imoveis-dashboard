export function centsToBRL(cents: number, fractionDigits = 2) {
  const value = cents / 100
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  })
}

export function formatPercentage(value: number) {
  return `${(value * 100).toFixed(0)}%`
}
