interface StatsCardsProps {
    stats: {
      failedTransactions: number
      failedTransactionsCount: number
      completedTransactions: number
      accountBalance: string
      currency: string
    }
  }
  
  export default function StatsCards({ stats }: StatsCardsProps) {
    return (
      <div className="grid grid-cols-4 gap-6 mb-8">
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
          <div className="text-3xl font-bold">{stats.failedTransactions}</div>
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
          <div className="text-3xl font-bold">{stats.failedTransactionsCount}</div>
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
          <div className="text-3xl font-bold">{stats.completedTransactions}</div>
        </div>
  
        <div className="bg-green-200 rounded-lg p-4 flex flex-col justify-center items-center">
          <div className="text-2xl font-bold">
            {stats.accountBalance} {stats.currency}
          </div>
          <div className="text-sm">Account Balance</div>
        </div>
      </div>
    )
  }
  
  