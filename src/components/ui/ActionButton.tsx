import { Button, type ButtonProps } from "@chakra-ui/react"
import type { ReactElement, ReactNode } from "react"

interface Props extends ButtonProps {
  label?: ReactNode
  icon?: ReactElement
}

export default function ActionButton({ label, icon, children, ...props }: Props) {
  return (
    <Button variant="primary" rightIcon={icon} {...props}>
      {children ?? label}
    </Button>
  )
}
