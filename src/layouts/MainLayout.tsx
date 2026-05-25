import { Box, Container } from "@chakra-ui/react"
import type { ReactNode } from "react"
import Header from "./Header"
import ListingDrawerComponent from "../components/listings/ListingDrawer"
import { useListingDrawer } from "../context/ListingDrawerContext"

interface Props {
  children: ReactNode
}

export default function MainLayout({ children }: Props) {
  const { selectedListing, closeDrawer } = useListingDrawer()

  return (
    <Box minH="100vh" bg="#0f1117" color="white">
      <Header />
      <Container maxW="8xl" py={8}>
        {children}
      </Container>
      <ListingDrawerComponent
        isOpen={!!selectedListing}
        onClose={closeDrawer}
        listing={selectedListing}
      />
    </Box>
  )
}
