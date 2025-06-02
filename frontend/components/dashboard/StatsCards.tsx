interface StatsCardsProps {
    stats: {
      failedTransactions: number
      failedTransactionsCount: number
      completedTransactions: number
      accountBalance: string
      currency: string
    }
  }
  import Image from "next/image";
  
  export default function StatsCards({ stats }: StatsCardsProps) {
    return (
      <div>
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mb-8">
            <div className="bg-blue-50 rounded-[20px]  p-6 flex flex-col justify-center items-center">
              <div className=" mb-2">
                <Image src="/transaction.png" alt="Pending Transaction" width={50} height={50} />
              </div>
              <div className="text-sm py-2">Number of Pending Transaction</div>
              <div className="text-3xl font-bold">{stats.failedTransactions}</div>
            </div>
            <div className="bg-blue-50 rounded-[20px]  p-6 flex flex-col justify-center items-center">
              <div className=" mb-2">
                <Image src="/transaction.png" alt="Pending Transaction" width={50} height={50} />
              </div>
              <div className="text-sm py-2">Number of Failed Transaction</div>
              <div className="text-3xl font-bold">{stats.failedTransactions}</div>
            </div>
            <div className="bg-blue-50 rounded-[20px]  p-6 flex flex-col justify-center items-center">
              <div className=" mb-2">
                <Image src="/transaction.png" alt="Pending Transaction" width={50} height={50} />
              </div>
              <div className="text-sm py-2">Number of Completed Transaction</div>
              <div className="text-3xl font-bold">{stats.failedTransactions}</div>
            </div>
          
          </div>
          <div className="flex md:justify-end justify-start items-center mb-6">
              <div className="bg-green-200 rounded-[20px] p-4 text-center ">
              <div className="text-2xl font-bold">
                {stats.accountBalance} {stats.currency}
              </div>
              <div className="text-sm">Account Balance</div>
              </div>
          </div>
      </div>
    )
  }
  
  