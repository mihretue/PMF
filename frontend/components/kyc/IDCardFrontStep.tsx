"use client"

import React, { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import type { KYCFormData } from "@/app/admin/profile/kyc/page"
import Select from "react-select"
import { FormControl, FormHelperText } from "@mui/material"

interface IDCardFrontStepProps {
  formData: KYCFormData
  updateFormData: (data: Partial<KYCFormData>) => void
  onNext: () => void
  onPrevious: () => void
}

type IDTypeOption = {
  value: string
  label: string
}

export default function IDCardFrontStep({ formData, updateFormData, onNext, onPrevious }: IDCardFrontStepProps) {
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const idTypeOptions: IDTypeOption[] = [
    { value: "passport", label: "Passport" },
    { value: "nationalId", label: "National ID" },
    { value: "driverLicense", label: "Driver License" },
    { value: "bpp", label: "BPP" }
  ]

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    handleFile(file)
  }

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  // Process the selected file
  const handleFile = (file: File | undefined) => {
    if (!file) return

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg"]
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPEG, PNG)")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB")
      return
    }

    // Clear any previous errors
    setError(null)

    // Create preview URL
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    // Update form data
    updateFormData({ idFrontImage: file })
  }

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>, active: boolean) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(active)
  }

  // Remove selected file
  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    updateFormData({ idFrontImage: null })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // Validate and proceed to next step
  const handleNext = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.idType) {
      newErrors.idType = "ID type is required"
    }

    if (!formData.idFrontImage) {
      newErrors.idFrontImage = "Please upload the front of your ID card"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onNext()
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-2">ID Card (Front)</h2>
      <p className="text-sm text-gray-500 mb-6">Please upload your ID card front for completing your KYC step.</p>

      {/* ID Type Selection */}
      <div className="mb-6">
        <label htmlFor="idType" className="block text-sm font-medium mb-1">
          Select ID type
        </label>
        <FormControl fullWidth error={!!errors.idType}>
          <Select<IDTypeOption>
            options={idTypeOptions}
            onChange={(selected) =>
              updateFormData({
                idType: selected?.value || "",
              })
            }
            value={idTypeOptions.find(option => option.value === formData.idType)}
            isClearable
            placeholder="Select the type of government issued file"
            styles={{
              control: (provided) => ({
                ...provided,
                height: "42px",
                minHeight: "42px",
                backgroundColor: "transparent",
                borderColor: errors.idType ? "#ef4444" : "#d1d5db",
                "&:hover": {
                  borderColor: errors.idType ? "#ef4444" : "#3b82f6",
                },
              }),
              valueContainer: (provided) => ({
                ...provided,
                height: "42px",
                padding: "0 8px",
              }),
              menu: (provided) => ({
                ...provided,
                zIndex: 9999,
              }),
            }}
          />
          {errors.idType && (
            <FormHelperText className="text-red-500 text-xs mt-1">
              {errors.idType}
            </FormHelperText>
          )}
        </FormControl>
      </div>

      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        } ${errors.idFrontImage ? "border-red-500" : ""}`}
        onDragOver={(e) => handleDrag(e, true)}
        onDragEnter={(e) => handleDrag(e, true)}
        onDragLeave={(e) => handleDrag(e, false)}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="relative">
            <Image
              src={previewUrl}
              alt="ID Card Front"
              width={300}
              height={200}
              className="mx-auto object-contain max-h-48"
            />
            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="py-4">
            <div className="mb-4 flex justify-center">
              <Upload className="text-blue-500" size={40} />
            </div>
            <p className="text-sm text-gray-600 mb-2">Drag and drop the file here or Choose File</p>
            <button
              type="button"
              onClick={handleUploadClick}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Browse Files
            </button>
          </div>
        )}

        <input 
          ref={fileInputRef} 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden" 
        />
      </div>

      {errors.idFrontImage && (
        <p className="mt-2 text-sm text-red-500">{errors.idFrontImage}</p>
      )}
      {error && !errors.idFrontImage && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}

      {/* Progress indicator */}
      {previewUrl && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-500 h-2.5 rounded-full w-full"></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Upload complete</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onPrevious}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}