import React from "react"
import ReactDOM from "react-dom/client"
import theme from "./theme"

import { ChakraProvider } from "@chakra-ui/react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import App from "./App"
import { FavoritesProvider } from "./context/FavoritesContext"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
