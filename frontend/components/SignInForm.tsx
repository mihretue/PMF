"use client"

import type React from "react"

import { useState, useContext } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import NotificationContext from "@/context/NotificationContext"
import { AUTH } from "@/app/api/endpoints" // Update to your actual path

export default function SignInForm() {
  const router = useRouter()
  const notificationCtx = useContext(NotificationContext)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    // rememberMe: false,
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [verificationNeeded, setVerificationNeeded] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

    // Reset verification needed state when email changes
    if (name === "email" && verificationNeeded) {
      setVerificationNeeded(false)
    }
  }

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    if (!formData.email.trim()) {
      newErrors.email = "Email is required."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address."
    }
    if (!formData.password) newErrors.password = "Password is required."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)

    const loginData = {
      email: formData.email,
      password: formData.password,
      // auth_type: "JWT", // ✅ append this field
    }

    try {
      const response = await fetch(AUTH.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "JWT", // 👈 this is the key fix
        },
        body: JSON.stringify(loginData),
      })

      const data = await response.json()

      if (response.ok) {
        const token = data.token || data.access // Depending on backend format

        console.log("see token", token)

        // r token in localStorage or cookie
        localStorage.setItem("auth_token", token)

        notificationCtx.showNotification({
          status: "success",
          message: "Logged in successfully!",
        })

        // Optional: Save token, redirect, etc.
        setTimeout(() => router.push("/admin/dashboard"), 1500)
      } else {
        // Check if the error is due to unverified account
        if (
          data.detail &&
          (data.detail.includes("verify") ||
            data.detail.includes("verification") ||
            data.detail.includes("unverified") ||
            data.detail.includes("not verified"))
        ) {
          setVerificationNeeded(true)

          // Generate a new OTP for the user
          try {
            await fetch(AUTH.GENERATE_OTP, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                subject: "Your OTP Code",
                email: formData.email,
              }),
            })
          } catch (error) {
            console.error("Error generating OTP:", error)
          }

          notificationCtx.showNotification({
            status: "warning",
            message: "Please verify your email before logging in.",
          })
        } else {
          notificationCtx.showNotification({
            status: "error",
            message: data.detail || "Login failed. Please check your credentials.",
          })
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      notificationCtx.showNotification({
        status: "error",
        message: "Network error. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    notificationCtx.showNotification({
      status: "info",
      message: "Google login not implemented yet.",
    })
  }

  return (
    <div className="flex flex-col md:flex-row items-center w-full max-w-5xl">
      <div className="w-full md:w-1/2 p-6 flex justify-center">
        <Image src="/login.png" alt="Login illustration" width={300} height={300} className="object-contain" priority />
      </div>

      <div className="w-full md:w-1/2 bg-gray-100/80 p-8 rounded-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                errors.email ? "border-red-500 focus:ring-red-500" : "border-blue-300 focus:ring-blue-500"
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                  errors.password ? "border-red-500 focus:ring-red-500" : "border-blue-300 focus:ring-blue-500"
                }`}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {verificationNeeded && (
            <div
              className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <p className="font-medium">Your account needs verification</p>
              <p className="text-sm mt-1">Please verify your email before logging in.</p>
              <div className="mt-2">
                <Link
                  href={`/verify-otp?email=${encodeURIComponent(formData.email)}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Verify your email now
                </Link>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className=" bg-[#3682AF] w-full text-white py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 flex items-center justify-center mt-4"
          >
            {isLoading ? (
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
                Signing in...
              </span>
            ) : (
              <>
                Sign in <ArrowRight className="ml-2" size={18} />
              </>
            )}
          </button>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                // checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>
        </form>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-100 text-gray-500">OR</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>

        <div className="mt-6 text-center text-sm">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/registration" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

