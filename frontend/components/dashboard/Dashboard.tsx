"use client";

import { Box, Button } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useEffect, useState } from "react";
import { GridColDef, GridCellParams } from "@mui/x-data-grid";
import Table from "../common/Table";
import StatsCards from "./StatsCards";
import TransactionDetailModal from "./TransactionDetailModal";
import { Transaction } from "./TransactionDetailModal";
import StatusButtonSmall from "../common/StatusButtonSmall";
import Link from "next/link";
import EmptyStateMessage from "../common/EmptyStateMessage";

export default function Dashboard() {
  const [selectedTransaction, setSelectedTransaction] = useState<
    Transaction | undefined
  >();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setLoading(true);
    // Simulate fetch call
    setTimeout(() => {
      setTransactions([]); // Replace with actual API data
      setLoading(false);
    }, 1000);
  }, []);

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
      renderCell: (params: GridCellParams<Transaction, Transaction["status"]>) => {
        const transactionStatus = params.value as string;
        const colorMap: Record<string, string> = {
          Completed: "#32CD32",
          Pending: "#1E90FF",
          Failed: "#A9A9A9",
        };
        const color = colorMap[transactionStatus] || "#A9A9A9";
        return (
          <StatusButtonSmall
            bgColor={color}
            text={transactionStatus || "Unknown"}
          />
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
      valueFormatter: (params: { value: Date | string }) =>
        new Date(params.value).toLocaleDateString(),
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
            handleRowClick(params.row as Transaction);
          }}
          sx={{
            textTransform: "none",
            borderColor: "#3682AF",
            color: "#3682AF",
            "&:hover": {
              borderColor: "#2a6f97",
              backgroundColor: "rgba(54, 130, 175, 0.04)",
            },
          }}
        >
          View Detail
        </Button>
      ),
    },
  ];
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1">
          <div className="flex items-center md:justify-end justify-start mb-10">
            <div className="flex space-x-3">
              <Link
                href="/admin/transactions/foreign-currency"
                className="px-4 py-2 bg-[#3682AF] text-white rounded-md"
              >
                Foreign Currency
              </Link>
              <Link
                href="/admin/transactions/send-money"
                className="px-4 py-2 border border-[#3682AF] text-[#3682AF] rounded-md"
              >
                Send Money
              </Link>
            </div>
          </div>

          <StatsCards
            stats={{
              failedTransactions: 0,
              failedTransactionsCount: 0,
              completedTransactions: 0,
              accountBalance: "0 Birr",
              currency: "",
            }}
          />

          <Box sx={{ marginTop: "30px" }}>
            {loading && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "40vh",
                }}
              >
                <Box className="loader" />
              </Box>
            )}

            {!loading && transactions.length === 0 && (
              <EmptyStateMessage message="You have no transactions" />
            )}

            {!loading && transactions.length > 0 && (
              <Table
                columns={columns}
                rows={transactions}
                onRowClick={handleRowClick}
              />
            )}
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
