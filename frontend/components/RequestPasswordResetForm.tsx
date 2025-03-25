"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function RequestPasswordResetForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Here you would integrate with your Django backend
      // Example:
      // const response = await fetch('your-django-api/request-password-reset', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // })

      console.log("Password reset requested for:", email)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success message
      setIsSubmitted(true)
    } catch (error) {
      console.error("Password reset request error:", error)
      // Handle error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-center w-full max-w-5xl">
      {/* Left side illustration */}
      <div className="w-full md:w-1/2 p-6 flex justify-center">
        <div className="max-w-xs">
          <Image
            src="/resetpasswordmain.png"
            alt="Reset password illustration"
            width={300}
            height={300}
            className="object-contain"
          />
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full md:w-1/2 bg-blue-50 p-8 rounded-lg">
        <div className="flex justify-center mb-4">
        <div className="max-w-xs">
          <Image
            src="/resetpassword.png"
            alt="Reset password illustration"
            width={200}
            height={200}
            className="object-contain"
          />
        </div>
        </div>

        <h1 className="text-2xl font-semibold text-center mb-6">Reset Password</h1>

        {isSubmitted ? (
          <div className="text-center space-y-4">
            <p className="text-green-600">Password reset link has been sent to your email.</p>
            <p className="text-sm text-gray-600">
              Please check your inbox and follow the instructions to reset your password.
            </p>
            <div className="mt-4">
              <Link href="/login" className="text-blue-600 hover:underline">
                Return to login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter email here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-[16px] bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {isLoading ? "Sending..." : "Send Link"}
            </button>

            <div className="text-center text-sm mt-[16px]">
              <Link href="/login" className="text-blue-600 hover:underline">
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

