"use client";

import { Box, Button } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useState } from "react";
import { GridColDef, GridCellParams } from "@mui/x-data-grid";
import Table from "../common/Table";
import StatsCards from "./StatsCards";
import TransactionDetailModal from "./TransactionDetailModal";
import { Transaction } from "./TransactionDetailModal";
import StatusButtonSmall from "../common/StatusButtonSmall";

export default function Dashboard() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>();
  const [openModal, setOpenModal] = useState(false);

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTransaction(undefined);
  };

  const columns: GridColDef<Transaction>[] = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 70,
      flex: 0.1,
      headerClassName: "custom-header",
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 140,
      flex: 0.2,
      headerClassName: "custom-header",
      renderCell: (params: GridCellParams) => {
        const transactionStatus = params.value as string;

        return (
          <>
            {transactionStatus === "Completed" && (
              <StatusButtonSmall bgColor="#32CD32" text="Completed" />
            )}
            {transactionStatus === "Pending" && (
              <StatusButtonSmall bgColor="#1E90FF" text="Pending" />
            )}
            {transactionStatus === "Failed" && (
              <StatusButtonSmall bgColor="#A9A9A9" text="Failed" />
            )}
            {transactionStatus !== "Completed" &&
              transactionStatus !== "Pending" &&
              transactionStatus !== "Failed" && (
                <StatusButtonSmall bgColor="#A9A9A9" text="Unknown" />
              )}
          </>
        );
      },
    },

    {
      field: "amount",
      headerName: "Amount",
      minWidth: 120,
      flex: 0.2,
      headerClassName: "custom-header",
      renderCell: (params: GridCellParams<Transaction, Transaction["amount"]>) => (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          ${params.value?.toFixed(2)}
        </Box>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 220,
      flex: 0.3,
      headerClassName: "custom-header",
    },
    {
      field: "date",
      headerName: "Date",
      minWidth: 120,
      flex: 0.2,
      headerClassName: "custom-header",
      valueFormatter: (params) => new Date(params.value as string).toLocaleDateString(),
    },
    {
      field: "actions",
      headerName: "Action",
      minWidth: 120,
      flex: 0.2,
      headerClassName: "custom-header",
      renderCell: (params: GridCellParams<Transaction>) => (
        <Button
          variant="outlined"
          size="small"
          startIcon={<VisibilityOutlinedIcon fontSize="small" />}
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick(params.row);
          }}
          sx={{
            textTransform: 'none',
            borderColor: '#3682AF',
            color: '#3682AF',
            '&:hover': {
              borderColor: '#2a6f97',
              backgroundColor: 'rgba(54, 130, 175, 0.04)'
            }
          }}
        >
          View Detail
        </Button>
      ),
    },
  ];

  const transactions: Transaction[] = [
    {
      id: 1,
      date: "2023-10-01",
      amount: 100.5,
      status: "Completed",
      description: "Payment for invoice #123",
    },
    {
      id: 2,
      date: "2023-10-02",
      amount: 75.25,
      status: "Pending",
      description: "Subscription renewal",
    },
    {
      id: 3,
      date: "2023-10-03",
      amount: 150.0,
      status: "Failed",
      description: "Refund processing",
    },
    {
      id: 4,
      date: "2023-10-04",
      amount: 200.75,
      status: "Completed",
      description: "Service fee",
    },
    {
      id: 5,
      date: "2023-10-05",
      amount: 50.0,
      status: "Pending",
      description: "Donation",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="flex items-center md:justify-end justify-start mb-10">
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-[#3682AF] text-white rounded-md">
                Foreign Currency
              </button>
              <button className="px-4 py-2 border border-[#3682AF] text-[#3682AF] rounded-md">
                Send Money
              </button>
            </div>
          </div>

          <StatsCards
            stats={{
              failedTransactions: 100,
              failedTransactionsCount: 333,
              completedTransactions: 10,
              accountBalance: "1K",
              currency: "ETB",
            }}
          />

          <Box sx={{ marginTop: "30px" }}>
            <Table
              columns={columns}
              rows={transactions}
              onRowClick={handleRowClick}
            />
          </Box>

          <TransactionDetailModal
            transaction={selectedTransaction}
            open={openModal}
            onClose={handleCloseModal}
          />
        </main>
      </div>
    </div>
  );
}