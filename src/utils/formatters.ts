export function centsToBRL(cents: number, fractionDigits = 2) {
  const value = cents / 100
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  })
}

export function formatPrice(value: number | string | null | undefined) {
  if (value == null || value === "") return ""

  // Normalize string values (handle formatted BRL like "1.234,56" or "R$ 1.234,56")
  if (typeof value === "string") {
    let str = value.trim()
    str = str.replace(/[R$\s]/g, "")

    if (str.includes(",") && str.includes(".")) {
      str = str.replace(/\./g, "").replace(",", ".")
    } else if (str.includes(",")) {
      str = str.replace(",", ".")
    }

    const n = Number(str)
    if (!Number.isFinite(n)) return ""
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(n)
  }

  // number
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value as number)
}

export function formatPercentage(value: number) {
  return `${(value * 100).toFixed(0)}%`
}
