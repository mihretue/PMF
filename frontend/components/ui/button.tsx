"use client"

import { Button as MuiButton, type ButtonProps as MuiButtonProps } from "@mui/material"
import { styled } from "@mui/material/styles"
import { forwardRef } from "react"

export interface ButtonProps extends MuiButtonProps {
  variant?: "contained" | "outlined" | "text"
}

// Styled MUI Button with different styles based on `variant`
const StyledButton = styled(MuiButton)<ButtonProps>(({ variant }) => ({
  ...(variant === "contained" && {
    background: "linear-gradient(90deg, #00FA91 0%, #3682AF 100%) !important",
    color: "white !important",
    "&:hover": {
      background: "linear-gradient(90deg, #00D97A 0%, #2C6E99 100%) !important",
    },
  }),
  ...(variant === "outlined" && {
    background: "white !important",
    color: "#3682AF !important",
    border: "2px solid #3682AF !important",
    "&:hover": {
      background: "#F0F0F0 !important",
    },
  }),
  ...(variant === "text" && {
    background: "transparent !important",
    color: "#3682AF !important",
    "&:hover": {
      background: "rgba(54, 130, 175, 0.1) !important",
    },
  }),
}))

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "contained", className, ...props }, ref) => {
    return (
      <StyledButton ref={ref} variant={variant} disableElevation {...props}>
        {children}
      </StyledButton>
    )
  }
)

Button.displayName = "Button"
