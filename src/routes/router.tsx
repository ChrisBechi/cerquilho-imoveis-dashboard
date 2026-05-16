import { createBrowserRouter, Navigate } from "react-router-dom"

import DashboardPage from "../pages/DashboardPage"
import FavoritesPage from "../pages/FavoritesPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardPage />
  },
  {
    path: "/favorites",
    element: <FavoritesPage />
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
])
