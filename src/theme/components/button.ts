const button = {
  baseStyle: {
    borderRadius: "full",
    fontWeight: "semibold",
    _focus: {
      boxShadow: "outline"
    }
  },
  variants: {
    primary: {
      bg: "accent",
      color: "white",
      _hover: {
        bg: "brand.600"
      },
      _active: {
        bg: "brand.700"
      }
    },
    secondary: {
      bg: "glass",
      color: "textPrimary",
      border: "1px solid",
      borderColor: "border",
      _hover: {
        bg: "glassHover"
      }
    },
    ghost: {
      bg: "transparent",
      color: "textPrimary",
      _hover: {
        bg: "glass"
      }
    },
    chip: {
      bg: "glass",
      color: "textPrimary",
      px: 4,
      py: 2,
      rounded: "full",
      fontSize: "sm",
      _hover: {
        bg: "glassHover"
      }
    }
  },
  defaultProps: {
    variant: "secondary"
  }
}

export default button
