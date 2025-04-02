import Link from "next/link"

export default function NotVerifiedBanner() {
  return (
    <div className="bg-blue-100 py-2 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-blue-500 text-white rounded-full p-1 mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <span className="text-sm">Account not verified. Complete KYC to start transactions</span>
        </div>
        <Link href="#" className="text-sm text-blue-600 hover:underline">
          here
        </Link>
      </div>
    </div>
  )
}

