"use client"

import { createTheme, ThemeProvider as MUIThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import type { ReactNode } from "react"

// Create a custom theme with the brand colors
const theme = createTheme({
  palette: {
    primary: {
      main: "#00FA91", // Brand green
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#1973A5", // Brand blue
      light: "rgba(219, 247, 252, 0.5)", // Lighter version for inputs
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#111111",
      secondary: "#868685",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "3.5rem",
      "@media (min-width:600px)": {
        fontSize: "4rem",
      },
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "10px 20px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedPrimary: {
          backgroundColor: "#00E88F",
          "&:hover": {
            backgroundColor: "rgba(0, 232, 143, 0.9)",
          },
        },
        outlined: {
          borderColor: "#e0e0e0",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& fieldset": {
            borderColor: "#e0e0e0",
          },
          "&:hover fieldset": {
            borderColor: "#b0b0b0",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#00E88F",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
          borderRadius: 12,
        },
      },
    },
  },
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  )
}

