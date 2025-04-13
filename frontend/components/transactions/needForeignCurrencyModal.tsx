"use client"

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  TextField,
  MenuItem,
  Button,
  Box,
  styled,
} from "@mui/material"
import { Close as CloseIcon, KeyboardArrowDown as KeyboardArrowDownIcon } from "@mui/icons-material"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: "#3682AF",
  color: "white",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2, 3),
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius,
    
  },
}))

export default function NeedForeignCurrencyModal({ onClose }: { onClose: () => void }) {
  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <StyledDialogTitle>
        <Typography variant="h6">Need Foreign Currency(UK + Ethiopia)</Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
          {/* Transaction Details */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="bold" color="black" gutterBottom>
              Request Details
            </Typography>

            <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Label htmlFor="amount">Amount</Label>
                <StyledTextField id="amount" fullWidth placeholder="Amount needed" variant="outlined" />
              </Box>

              <Box>
                <Label htmlFor="currency">Currency Type</Label>
                <StyledTextField
                  id="currency"
                  select
                  fullWidth
                  placeholder="Currency type"
                  variant="outlined"
                  
                >
                  <MenuItem value="usd">USD - US Dollar</MenuItem>
                  <MenuItem value="eur">EUR - Euro</MenuItem>
                  <MenuItem value="gbp">GBP - British Pound</MenuItem>
                </StyledTextField>
              </Box>

              <Box>
                <Label htmlFor="payment-method">Payment Method</Label>
                <StyledTextField
                  id="payment-method"
                  select
                  fullWidth
                  placeholder="Payment Method"
                  variant="outlined"
                 
                >
                  <MenuItem value="card">Credit/Debit Card</MenuItem>
                  <MenuItem value="bank">Bank Transfer</MenuItem>
                  <MenuItem value="wallet">Digital Wallet</MenuItem>
                </StyledTextField>
              </Box>

              <Box>
                <Label htmlFor="purpose">Purpose of Request</Label>
                <StyledTextField id="purpose" fullWidth placeholder="Purpose of Transaction" variant="outlined" />
              </Box>

              <Box>
                <Label htmlFor="exchange-rate">Urgency Level </Label>
                <StyledTextField
                  id="exchange-rate"
                  select
                  fullWidth
                  placeholder="Urgency Level"
                  variant="outlined"
                 
                >
                  <MenuItem value="rate1">Urgent</MenuItem>
                  <MenuItem value="rate2">Not Urgent</MenuItem>
                </StyledTextField>
              </Box>

              <Box>
                <Label htmlFor="fee">Transaction Fee</Label>
                <StyledTextField
                  id="fee"
                  fullWidth
                  placeholder="Transaction Fee (Auto-Filled)"
                  variant="outlined"
                  disabled
                  value="$5.00"
                />
              </Box>
            </Box>
          </Box>

          {/* Recipient Details */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="bold" color="black" gutterBottom>
              UK Recipient Details
            </Typography>

            <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Label htmlFor="full-name">Full Name</Label>
                <StyledTextField id="full-name" fullWidth placeholder="Full Name" variant="outlined" />
              </Box>

              <Box>
                <Label htmlFor="phone">Account Number</Label>
                <Box sx={{ display: "flex" }}>
              
                  <StyledTextField
                    id="phone"
                    fullWidth
                    placeholder="Account Number"
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                      },
                    }}
                  />
                </Box>
              </Box>

              <Box>
                <Label htmlFor="bank-name">Sort Code</Label>
                <StyledTextField
                  id="bank-name"
                  
                  fullWidth
                  placeholder="Sort Code"
                  variant="outlined"
              
                >
                 
                </StyledTextField>
              </Box>

              

              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <Checkbox id="confirm" color="primary" />
                <Label htmlFor="confirm" sx={{ ml: 1 }}>
                  I confirm the transaction details are correct
                </Label>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              px: 4,
              bgcolor: "primary.dark",
              "&:hover": {
                bgcolor: "primary.dark",
                opacity: 0.9,
              },
            }}
          >
            Submit
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
