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

export default function SendMoneyModal({ onClose }: { onClose: () => void }) {
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
        <Typography variant="h6">Send Money</Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
          {/* Transaction Details */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="bold" color="black" gutterBottom>
              Transaction Details
            </Typography>

            <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Label htmlFor="amount">Amount</Label>
                <StyledTextField id="amount" fullWidth placeholder="Amount to send" variant="outlined" />
              </Box>

              <Box>
                <Label htmlFor="currency">Currency Type</Label>
                <StyledTextField
                  id="currency"
                  select
                  fullWidth
                  placeholder="Currency type"
                  variant="outlined"
                  InputProps={{
                    endAdornment: <KeyboardArrowDownIcon />,
                  }}
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
                  InputProps={{
                    endAdornment: <KeyboardArrowDownIcon />,
                  }}
                >
                  <MenuItem value="card">Credit/Debit Card</MenuItem>
                  <MenuItem value="bank">Bank Transfer</MenuItem>
                  <MenuItem value="wallet">Digital Wallet</MenuItem>
                </StyledTextField>
              </Box>

              <Box>
                <Label htmlFor="purpose">Purpose</Label>
                <StyledTextField id="purpose" fullWidth placeholder="Purpose of Transaction" variant="outlined" />
              </Box>

              <Box>
                <Label htmlFor="exchange-rate">Exchange Rate</Label>
                <StyledTextField
                  id="exchange-rate"
                  select
                  fullWidth
                  placeholder="Exchange Rate (Auto filled)"
                  variant="outlined"
                  InputProps={{
                    endAdornment: <KeyboardArrowDownIcon />,
                  }}
                >
                  <MenuItem value="rate1">1 USD = 54.32 ETB</MenuItem>
                  <MenuItem value="rate2">1 EUR = 60.15 ETB</MenuItem>
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
              Recipient Details
            </Typography>

            <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Label htmlFor="full-name">Full Name</Label>
                <StyledTextField id="full-name" fullWidth placeholder="Full Name" variant="outlined" />
              </Box>

              <Box>
                <Label htmlFor="phone">Phone Number</Label>
                <Box sx={{ display: "flex" }}>
                  <StyledTextField
                    select
                    sx={{
                      width: "80px",
                      "& .MuiOutlinedInput-root": {
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                      },
                    }}
                    variant="outlined"
                    defaultValue="et"
                  >
                    <MenuItem value="et">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          component="img"
                          src="/placeholder.svg?height=16&width=24"
                          alt="Ethiopia"
                          sx={{ width: 24, height: 16, mr: 1 }}
                        />
                      </Box>
                    </MenuItem>
                  </StyledTextField>
                  <StyledTextField
                    id="phone"
                    fullWidth
                    placeholder="Enter phone number"
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
                <Label htmlFor="bank-name">Bank Name</Label>
                <StyledTextField
                  id="bank-name"
                  select
                  fullWidth
                  placeholder="Bank Name"
                  variant="outlined"
                  InputProps={{
                    endAdornment: <KeyboardArrowDownIcon />,
                  }}
                >
                  <MenuItem value="bank1">Commercial Bank of Ethiopia</MenuItem>
                  <MenuItem value="bank2">Dashen Bank</MenuItem>
                  <MenuItem value="bank3">Awash Bank</MenuItem>
                </StyledTextField>
              </Box>

              <Box>
                <Label htmlFor="account-number">Account Number</Label>
                <StyledTextField id="account-number" fullWidth placeholder="Bank account number" variant="outlined" />
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
