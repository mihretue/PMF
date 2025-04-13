"use client"
import { X } from "lucide-react"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"

interface RateAlertModalProps {
  open: boolean
  onClose: () => void
}

export default function RateAlertModal({ open, onClose }: RateAlertModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
          m: { xs: 2, sm: 4 },
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "#3682af",
          color: "white",
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" fontWeight={500}>
        Set Exchange Rate Alert
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Get notified when the exchange rate reaches your desired value.
        </Typography>

        <TextField
          fullWidth
          placeholder="Enter value"
          variant="outlined"
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              p: 1.5,
            },
          }}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            bgcolor: "#3682af",
            "&:hover": { bgcolor: "#33b0e6" },
            py: 1.5,
          }}
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  )
}
