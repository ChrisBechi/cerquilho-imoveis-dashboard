import { extendTheme } from "@chakra-ui/react"
import colors from "./colors"
import shadows from "./shadows"
import radii from "./radii"
import spacing from "./spacing"
import typography from "./typography"
import buttonStyles from "./components/button"
import cardStyles from "./components/card"
import inputStyles from "./components/input"
import badgeStyles from "./components/badge"
import drawerStyles from "./components/drawer"
import tableStyles from "./components/table"

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "surfaceAccent",
        color: "textPrimary",
        minHeight: "100vh",
        fontFamily: "Inter, system-ui, sans-serif",
        lineHeight: "normal"
      },
      "*::selection": {
        background: "rgba(79, 140, 255, 0.24)"
      }
    }
  },
  colors,
  shadows,
  radii,
  space: spacing,
  ...typography,
  components: {
    Button: buttonStyles,
    Card: cardStyles,
    Input: inputStyles,
    Badge: badgeStyles,
    Drawer: drawerStyles,
    Table: tableStyles
  }
})

export default theme
