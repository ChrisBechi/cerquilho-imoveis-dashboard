const parts = ["table", "thead", "tbody", "tr", "th", "td"]

const table = {
  parts,
  baseStyle: {
    th: {
      color: "textSecondary",
      fontWeight: "semibold",
      borderBottom: "1px solid",
      borderColor: "border",
      bg: "surface",
      py: 4
    },
    td: {
      color: "textPrimary",
      borderBottom: "1px solid",
      borderColor: "border"
    }
  }
}

export default table
