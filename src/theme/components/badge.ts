const badge = {
  baseStyle: {
    borderRadius: "full",
    textTransform: "uppercase",
    letterSpacing: "0.06em"
  },
  variants: {
    subtle: {
      bg: "glass",
      color: "textPrimary"
    },
    outline: {
      bg: "transparent",
      border: "1px solid",
      borderColor: "border",
      color: "textSecondary"
    },
    solid: {
      bg: "accent",
      color: "white"
    }
  },
  defaultProps: {
    variant: "subtle"
  }
}

export default badge
