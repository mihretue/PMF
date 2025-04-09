"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, RefreshCw } from 'lucide-react'
import NotificationContext from "@/context/NotificationContext"
import { AUTH } from "@/app/api/endpoints"

export default function OtpVerificationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const notificationCtx = useContext(NotificationContext)

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(true) // Start with resend disabled
  const [countdown, setCountdown] = useState(30)

  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null))

  useEffect(() => {
    // Initialize the countdown timer when component mounts
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setResendDisabled(false)
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const generateOtp = async (emailAddress: string) => {
    if (!emailAddress) return
    
    setError("")
    setIsResending(true)

    try {
      const response = await fetch(AUTH.GENERATE_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: "Verify your email address",
          email: emailAddress,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send OTP")
      }

      notificationCtx.showNotification({
        status: "success",
        message: "Verification code sent to your email",
      })

      setResendDisabled(true)
      setCountdown(30)

      // Restart the countdown timer
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setResendDisabled(false)
            return 30
          }
          return prev - 1
        })
      }, 1000)
    } catch (error) {
      console.error("Error generating OTP:", error)
      notificationCtx.showNotification({
        status: "error",
        message: "Failed to send verification code. Please try again.",
      })
    } finally {
      setIsResending(false)
    }
  }

  const handleResendOtp = () => {
    if (email && !resendDisabled && !isResending) {
      generateOtp(email)
    }
  }

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("")
      setOtp(digits)
      inputRefs.current[5]?.focus()
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsVerifying(true)

    const otpValue = otp.join("")

    if (otpValue.length !== 6 || !/^\d{6}$/.test(otpValue)) {
      setError("Please enter a valid 6-digit code")
      notificationCtx.showNotification({
        status: "error",
        message: "Please enter a valid 6-digit code",
      })
      setIsVerifying(false)
      return
    }

    try {
      const response = await fetch(AUTH.VERIFY_OTP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          otp: otpValue,
        }),
      })

      if (!response.ok) {
        throw new Error("Invalid verification code")
      }

      setSuccess(true)
      notificationCtx.showNotification({
        status: "success",
        message: "Email verified successfully! Redirecting to login...",
      })

      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (error) {
      console.error("Error verifying OTP:", error)
      setError("Invalid verification code. Please try again.")
      notificationCtx.showNotification({
        status: "error",
        message: "Invalid verification code. Please try again.",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-center w-full max-w-5xl">
      <div className="w-full md:w-1/2 p-6 flex justify-center">
        <div className="max-w-xs">
          <Image
            src="/otp.png"
            alt="Verification illustration"
            width={1000}
            height={800}
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-gray-100/80 p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#3682AF]"
            >
              <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path>
              <line x1="2" y1="20" x2="2" y2="20"></line>
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-center mb-2">Verify Your Email</h1>

        {success ? (
          <div className="text-center space-y-4">
            <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4">
              <p className="font-medium">Email verified successfully!</p>
              <p className="text-sm mt-1">Redirecting you to login...</p>
            </div>
            <Link href="/login" className="text-[#3682AF] hover:underline">
              Go to login
            </Link>
          </div>
        ) : (
          <>
            <p className="text-center text-gray-600 mb-6">
              We&apos;ve sent a verification code to{" "}
              <span className="font-bold">{email || "your email"}</span>
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex justify-center items-center" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-3 text-center">
                  Enter verification code
                </label>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el
                      }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className="w-12 h-12 text-center text-xl font-bold border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3682AF]"
                      disabled={isVerifying}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-[#3682AF] text-white py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 flex items-center justify-center"
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  <>
                    Verify Email <ArrowRight className="ml-2" size={18} />
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Didn&apos;t receive the code?</p>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendDisabled || isResending}
                  className="text-[#3682AF] hover:underline flex items-center justify-center mx-auto disabled:opacity-50 disabled:hover:no-underline"
                >
                  <RefreshCw size={16} className={`mr-1 ${isResending && "animate-spin"}`} />
                  {resendDisabled ? `Resend in ${countdown}s` : isResending ? "Sending..." : "Resend Code"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}