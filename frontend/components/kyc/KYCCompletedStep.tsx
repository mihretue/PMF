import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function KYCCompletedStep() {
  return (
    <div className="max-w-md mx-auto text-center py-8">
      <div className="flex justify-center mb-6">
        <div className="bg-blue-500 rounded-full p-6">
          <CheckCircle className="text-white" size={40} />
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Completed</h2>

      <p className="text-gray-600 mb-8">You successfully completed your KYC. Wait for approval!</p>

      <Link
        href="/dashboard"
        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors inline-block"
      >
        Edit KYC
      </Link>
    </div>
  )
}

