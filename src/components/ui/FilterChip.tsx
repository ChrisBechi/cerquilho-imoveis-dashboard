import { Button, type ButtonProps } from "@chakra-ui/react"
import type { ReactNode } from "react"

interface Props extends ButtonProps {
  isActive?: boolean
  children: ReactNode
}

export default function FilterChip({ isActive, children, ...props }: Props) {
  return (
    <Button
      variant="chip"
      px={4}
      py={2}
      color={isActive ? "textPrimary" : "textSecondary"}
      bg={isActive ? "glassHover" : "glass"}
      borderColor={isActive ? "accent" : "border"}
      borderWidth="1px"
      _hover={{ bg: "glassHover" }}
      {...props}
    >
      {children}
    </Button>
  )
}
