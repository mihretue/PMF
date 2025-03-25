"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

interface SetupNewPasswordFormProps {
  token: string;
}

export default function SetupNewPasswordForm({
  token,
}: SetupNewPasswordFormProps) {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // Here you would integrate with your Django backend
      // Example:
      // const response = await fetch('your-django-api/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     token,
      //     password: formData.newPassword
      //   })
      // })

      console.log(
        "Password reset with token:",
        token,
        "New password:",
        formData.newPassword
      );
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      setIsSubmitted(true);
    } catch (error) {
      console.error("Password reset error:", error);
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center w-full max-w-5xl">
      {/* Left side illustration */}
      <div className="w-full md:w-1/2 p-6 flex justify-center">
        <div className="max-w-xs">
          <Image
            src="/resetpasswordmain2.png"
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
              src="/resetpassword2.png"
              alt="Reset password illustration"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-center mb-6">
          Setup New Password
        </h1>

        {isSubmitted ? (
          <div className="text-center space-y-4 ">
            <p className="text-green-600">
              Your password has been successfully reset!
            </p>
            <div className="mt-4">
              <Link
                href="/login"
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors inline-block"
              >
                Go to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium mb-1"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="••••••"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {isLoading ? "Changing..." : "Change Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
