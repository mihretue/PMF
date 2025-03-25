"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would integrate with your Django backend
      // Example:
      // const response = await fetch('your-django-api/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })

      console.log("Form submitted:", formData);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Handle successful signup
      // Redirect or show success message
    } catch (error) {
      console.error("Signup error:", error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    // Implement Google OAuth integration
    console.log("Sign up with Google");
  };

  return (
    <div className="flex flex-col md:flex-row items-center w-full max-w-5xl">
      {/* Left side illustration */}
      <div className="w-full md:w-1/2 p-6 flex justify-center">
        <div className="max-w-xs">
          <Image
            src="/signup.webp"
            alt="Security illustration"
            width={300}
            height={300}
            className="object-contain"
          />
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full md:w-1/2 bg-gray-100/80 p-8 rounded-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">Sign Up</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium mb-1"
            >
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium mb-1"
            >
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email name"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium mb-1"
            >
              Phone number
            </label>

            <PhoneInput
              country={"gb"} // Default country
              value={formData.phoneNumber}
              onChange={(phone: string) =>
                setFormData((prev) => ({
                  ...prev,
                  phoneNumber: phone,
                }))
              }
              onlyCountries={["gb", "et", "us", "ca", ""]} // Add more here if needed
              enableSearch={true}
              inputStyle={{
                width: "100%",
                height: "2.5rem",
                fontSize: "0.875rem",
                borderRadius: "0.375rem",
                border: "1px solid #93c5fd",
                paddingLeft: "48px",
                paddingRight: "0.75rem",
                backgroundColor: "rgba(243, 244, 246, 0.8)",
                color: "#111827",
              }}
              containerStyle={{ width: "100%" }}
              buttonStyle={{
                border: "1px solid #93c5fd",
                backgroundColor: "#fff",
                // paddingLeft: "0.2rem",
                paddingRight: "0.5rem",
              }}
              dropdownStyle={{
                borderRadius: "0.375rem",
                border: "1px solid #d1d5db",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
              }}
              inputProps={{
                name: "phoneNumber",
                required: true,
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
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
                required
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
          >
            {isLoading ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>

        <div className="mt-4 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-100 text-gray-500">OR</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignUp}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="18"
            height="18"
          >
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
          Sign up with Google
        </button>
      </div>
    </div>
  );
}
