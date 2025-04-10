"use client";

import TransactionDetailModal from '@/components/dashboard/TransactionDetailModal';
import TransactionsTable from '@/components/dashboard/TransactionsTable';

import { Button } from '@/components/ui/button';
import React from 'react';
import NeedForeignCurrencyModal from '@/components/dashboard/needForeignCurrencyModal';

export default function page() {
  const transactions: any[] = [
    {
      id: 1,
      sender: "John Doe",
      receiver: "Jane Smith",
      amount: 500,
      currency: "USD",
      date: "2025-04-10",
      status: "Completed",
    },
    {
      id: 2,
      sender: "Alice Johnson",
      receiver: "Bob Brown",
      amount: 300,
      currency: "EUR",
      date: "2025-04-09",
      status: "Pending",
    },
    {
      id: 3,
      sender: "Charlie Davis",
      receiver: "Diana Evans",
      amount: 1000,
      currency: "GBP",
      date: "2025-04-08",
      status: "Failed",
    },
  ]; 
  const totalPages = 1; 

  const [openTransactionModal, setOpenTransactionModal] = React.useState(false);
  const [openNeedForeignCurrencyModal, setOpenNeedForeignCurrencyModal] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] = React.useState<any | null>(null);

  function handleViewDetails(transaction: any): void {
    setSelectedTransaction(transaction);
    setOpenTransactionModal(true);
  }

  return (
    <div>
      {/* Button to open Need Foreign Currency Modal */}
      <Button variant='outlined' onClick={() => setOpenNeedForeignCurrencyModal(true)}>
        Need Foreign Currency
      </Button>

      {/* Transactions Table */}
      <TransactionsTable 
        transactions={transactions} 
        totalPages={totalPages} 
        onViewDetails={handleViewDetails} 
      />

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <TransactionDetailModal 
          open={openTransactionModal} 
          onClose={() => setOpenTransactionModal(false)} 
          transaction={selectedTransaction} 
        />
      )}

      {/* Need Foreign Currency Modal */}
      {openNeedForeignCurrencyModal && (
        <NeedForeignCurrencyModal onClose={() => setOpenNeedForeignCurrencyModal(false)} />
      )}
    </div>
  );
}