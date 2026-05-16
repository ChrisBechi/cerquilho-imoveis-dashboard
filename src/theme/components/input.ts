const input = {
  baseStyle: {
    field: {
      bg: "glass",
      borderColor: "border",
      color: "textPrimary",
      _placeholder: {
        color: "textSecondary"
      },
      _hover: {
        bg: "glassHover",
        borderColor: "accent"
      },
      _focus: {
        borderColor: "accent",
        boxShadow: "focusRing",
        bg: "glass"
      }
    }
  },
  variants: {
    outline: {
      field: {
        bg: "glass"
      }
    }
  }
}

export default input
