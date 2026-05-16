import { Box, Container } from "@chakra-ui/react"
import type { ReactNode } from "react"
import Header from "./Header"

interface Props {
  children: ReactNode
}

export default function MainLayout({ children }: Props) {
  return (
    <Box minH="100vh" bg="#0f1117" color="white">
      <Header />
      <Container maxW="8xl" py={8}>
        {children}
      </Container>
    </Box>
  )
}
