"use client"

import * as React from 'react';
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

interface CustomDatePickerProps {
  value: string | null;
  onChange: (value: string) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
  height?: number | string;
}

export function CustomDatePicker({
  value,
  onChange,
  label = 'Select date',
  error = false,
  helperText,
  height = 42, // Default height matches your form inputs
}: CustomDatePickerProps) {
  const handleChange = (date: Dayjs | null) => {
    onChange(date?.format('YYYY-MM-DD') || '');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value ? dayjs(value) : null}
        onChange={handleChange}
        sx={{
          width: '100%',
          '& .MuiOutlinedInput-root': {
            height: typeof height === 'number' ? `${height}px` : height,
            '& fieldset': {
              borderColor: error ? '#ef4444' : '#d1d5db',
            },
            '&:hover fieldset': {
              borderColor: error ? '#ef4444' : '#3b82f6',
            },
          },
        }}
        slotProps={{
          textField: {
            size: 'small',
            error: error,
            helperText: helperText,
          },
        }}
      />
    </LocalizationProvider>
  );
}