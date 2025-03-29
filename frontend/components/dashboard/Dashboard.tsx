"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,

} from "lucide-react"
import StatsCards from "./StatsCards"


// Sample transaction data
const transactionsData = [
  {
    id: "0001",
    status: "Completed",
    amount: "120000",
    currency: "USD",
    date: "14 June 2024, 2:43 PM",
  },
  {
    id: "0002",
    status: "Failed",
    amount: "120000",
    currency: "EUR",
    date: "14 June 2024, 2:43 PM",
  },
  {
    id: "0003",
    status: "Pending",
    amount: "12000",
    currency: "ETB",
    date: "14 June 2024, 2:43 PM",
  },
  {
    id: "0004",
    status: "Completed",
    amount: "140000",
    currency: "USD",
    date: "14 June 2024, 2:43 PM",
  },
]

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 12

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
       

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto ">
          <div className="flex items-center md:justify-end justify-start mb-10">
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md">Foreign Currency</button>
              <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md">Send Money</button>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards stats={{ failedTransactions: 100, failedTransactionsCount: 333, completedTransactions: 10, accountBalance: "1K", currency: "ETB" }} />
          {/* <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z"
                      stroke="#111827"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="text-sm">Failed Transaction</div>
              </div>
              <div className="text-3xl font-bold">45</div>
            </div>

            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z"
                      stroke="#111827"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="text-sm">Failed Transaction</div>
              </div>
              <div className="text-3xl font-bold">867</div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z"
                      stroke="#111827"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="text-sm">Completed Transaction</div>
              </div>
              <div className="text-3xl font-bold">87</div>
            </div>

            <div className="bg-green-200 rounded-lg p-4 flex flex-col justify-center items-center">
              <div className="text-2xl font-bold">60K ETB</div>
              <div className="text-sm">Account Balance</div>
            </div>
          </div> */}

          {/* Transactions Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium">Transactions Table</h2>
              <div className="flex items-center">
                <span className="mr-2 text-sm">Sort By</span>
                <div className="relative">
                  <select className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Latest Date</option>
                    <option>Oldest Date</option>
                    <option>Amount (High to Low)</option>
                    <option>Amount (Low to High)</option>
                  </select>
                  <ChevronDown
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount Sent/Received
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Currency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactionsData.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={transaction.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.currency}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="px-3 py-1 border border-blue-500 text-blue-500 rounded-md text-xs">
                          View detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing Page <span className="font-medium">{currentPage}</span> Out of{" "}
                <span className="font-medium">{totalPages}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded-md border border-gray-300 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>

                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      currentPage === page ? "bg-blue-500 text-white" : "border border-gray-300 text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <span className="flex items-center">...</span>

                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 text-gray-700`}
                >
                  {totalPages}
                </button>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-md border border-gray-300 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// Helper Components
// function SidebarItem({ icon, text, active = false }) {
//   return (
//     <Link
//       href="#"
//       className={`flex items-center px-4 py-2 text-sm rounded-lg ${
//         active ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
//       }`}
//     >
//       <span className="mr-3">{icon}</span>
//       <span>{text}</span>
//     </Link>
//   )
// }

function StatusBadge({ status }) {
  let bgColor = "bg-gray-100 text-gray-800"

  if (status === "Completed") {
    bgColor = "bg-green-100 text-green-800"
  } else if (status === "Failed") {
    bgColor = "bg-red-100 text-red-800"
  } else if (status === "Pending") {
    bgColor = "bg-blue-100 text-blue-800"
  }

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}>{status}</span>
  )
}

