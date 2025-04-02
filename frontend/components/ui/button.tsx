"use client"

import { Button as MuiButton, type ButtonProps as MuiButtonProps } from "@mui/material"
import { forwardRef } from "react"

export interface ButtonProps extends MuiButtonProps {
  variant?: "contained" | "outlined" | "text"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "contained", className, ...props }, ref) => {
    return (
      <MuiButton ref={ref} variant={variant} className={className} disableElevation {...props}>
        {children}
      </MuiButton>
    )
  },
)

Button.displayName = "Button"

