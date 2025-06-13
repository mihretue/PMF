"use client"

import React from "react"
import { Checkbox as MuiCheckbox, type CheckboxProps as MuiCheckboxProps, styled } from "@mui/material"
import { Check } from "@mui/icons-material"

const StyledCheckbox = styled(MuiCheckbox)(({ theme }) => ({
  padding: theme.spacing(0.5),
  color: theme.palette.grey[400],
  "&.Mui-checked": {
    color: theme.palette.primary.main,
  },
  "&:hover": {
    backgroundColor: "transparent",
  },
}))

export interface CheckboxProps extends Omit<MuiCheckboxProps, "classes"> {
  indeterminate?: boolean
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(({ indeterminate, ...props }, ref) => {
  const { color = "primary", size = "medium", className, ...otherProps } = props

  return (
    <StyledCheckbox
      ref={ref}
      color={color}
      size={size}
      indeterminate={indeterminate}
      checkedIcon={<Check />}
      {...otherProps}
    />
  )
})

Checkbox.displayName = "Checkbox"
