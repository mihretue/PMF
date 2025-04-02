"use client"

import type React from "react"

import { useState } from "react"
import { Calendar } from "lucide-react"
import type { KYCFormData } from "@/app/admin/profile/kyc/page"

interface PersonalInformationStepProps {
  formData: KYCFormData
  updateFormData: (data: Partial<KYCFormData>) => void
  onNext: () => void
}

export default function PersonalInformationStep({ formData, updateFormData, onNext }: PersonalInformationStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required"
    }

    if (!formData.idType) {
      newErrors.idType = "ID type is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onNext()
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-6">Personal Information</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-1">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            placeholder="Enter Your First Name"
            value={formData.firstName}
            onChange={(e) => updateFormData({ firstName: e.target.value })}
            className={`w-full px-3 py-2 border ${errors.firstName ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
          />
          {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-1">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            placeholder="Enter Your Last Name"
            value={formData.lastName}
            onChange={(e) => updateFormData({ lastName: e.target.value })}
            className={`w-full px-3 py-2 border ${errors.lastName ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
          />
          {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium mb-1">
            Date of Birth
          </label>
          <div className="relative">
            <input
              id="dateOfBirth"
              type="date"
              placeholder="DD/MM/YYYY"
              value={formData.dateOfBirth}
              onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
              className={`w-full px-3 py-2 border ${errors.dateOfBirth ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          {errors.dateOfBirth && <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>}
        </div>

        {/* ID Type */}
        <div>
          <label htmlFor="idType" className="block text-sm font-medium mb-1">
            Select the type of government issued file
          </label>
          <select
            id="idType"
            value={formData.idType}
            onChange={(e) => updateFormData({ idType: e.target.value })}
            className={`w-full px-3 py-2 border ${errors.idType ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
          >
            <option value="" disabled>
              Select
            </option>
            <option value="passport">Passport</option>
            <option value="nationalId">National ID</option>
            <option value="driverLicense">Driver License</option>
            <option value="bpp">BPP</option>
          </select>
          {errors.idType && <p className="mt-1 text-xs text-red-500">{errors.idType}</p>}
        </div>

        {/* Next Button */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  )
}

