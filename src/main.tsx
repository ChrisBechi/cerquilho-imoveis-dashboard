import React from "react"
import ReactDOM from "react-dom/client"
import theme from "./theme"

import { ChakraProvider } from "@chakra-ui/react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import App from "./App"
import { FavoritesProvider } from "./context/FavoritesContext"
import { NotificationsProvider } from "./context/NotificationsContext"
import { ListingDrawerProvider } from "./context/ListingDrawerContext"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <NotificationsProvider>
          <FavoritesProvider>
            <ListingDrawerProvider>
              <App />
            </ListingDrawerProvider>
          </FavoritesProvider>
        </NotificationsProvider>
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
