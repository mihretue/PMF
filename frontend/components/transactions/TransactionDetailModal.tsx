"use client";

import { Box, Modal, Typography, Stack, IconButton } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

export interface Transaction {
  id: number;
  amount: number;
  date: string;
  status: "Completed" | "Pending" | "Failed";
  description: string;
}

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    maxWidth: "90%",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
  };

interface TransactionDetailModalProps {
  transaction: Transaction | undefined;
  open: boolean;
  onClose: () => void;
}

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ display: "flex" }}>
    <Typography variant="subtitle1" sx={{ fontWeight: "bold", minWidth: 120 }}>
      {label}:
    </Typography>
    <Typography variant="body1">{value}</Typography>
  </Box>
);

const TransactionDetailModal = ({
  transaction,
  open,
  onClose,
}: TransactionDetailModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
      <Box
         sx={{
           backgroundColor: "#3682AF",
           width: "100%",
          height: "60px",
                  paddingX: { xs: 2, lg: 3 },
                  paddingY: { xs: 1, lg: 2 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderTopLeftRadius: '8px',
                  borderTopRightRadius: '8px',
                }}
              >
                <Typography variant="h6" sx={{ color: "white" }}>
                Transaction Details
                </Typography>
                <IconButton
                  aria-label="close"
                //   onClick={onClose}
                  sx={{
                    color: "white",
                  }}
                  onClick={onClose}
                >
                  <CloseOutlinedIcon />
                </IconButton>
              </Box>
           <Box sx={{padding: '20px'}}>
            {transaction && (
              <Stack spacing={1}>
                <DetailRow label="ID" value={transaction.id.toString()} />
                <DetailRow label="Date" value={new Date(transaction.date).toLocaleDateString()} />
                <DetailRow label="Amount" value={`$${transaction.amount.toFixed(2)}`} />
                <DetailRow label="Status" value={transaction.status} />
                <DetailRow label="Description" value={transaction.description} />
              </Stack>
            )}
          </Box>
      </Box>
    </Modal>
  );
};

export default TransactionDetailModal;