"use client"

import React from "react"
import { FormLabel, styled } from "@mui/material"

const StyledLabel = styled(FormLabel)(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: 500,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(0.5),
  display: "block",
  "&.Mui-disabled": {
    cursor: "not-allowed",
    opacity: 0.7,
  },
}))

export interface LabelProps extends React.ComponentPropsWithoutRef<typeof FormLabel> {
  htmlFor?: string
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, children, ...props }, ref) => {
  return (
    <StyledLabel ref={ref} {...props}>
      {children}
    </StyledLabel>
  )
})

Label.displayName = "Label"
