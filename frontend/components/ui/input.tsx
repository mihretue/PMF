"use client"

import { TextField, type TextFieldProps } from "@mui/material"
import { forwardRef } from "react"

// Update the Input component to allow passing sx props to the TextField
export interface InputProps extends Omit<TextFieldProps, "variant"> {
  variant?: "outlined" | "standard" | "filled"
  sx?: any
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = "outlined", className, sx, ...props }, ref) => {
    return <TextField variant={variant} fullWidth inputRef={ref} className={className} sx={sx} {...props} />
  },
)

Input.displayName = "Input"

