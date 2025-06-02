"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { X, Camera } from "lucide-react"
import type { KYCFormData } from "@/app/admin/profile/kyc/page"

interface UserPhotoStepProps {
  formData: KYCFormData
  updateFormData: (data: Partial<KYCFormData>) => void
  onSubmit: () => void
  onPrevious: () => void
}

export default function UserPhotoStep({ formData, updateFormData, onSubmit, onPrevious }: UserPhotoStepProps) {
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    updateFormData({ userPhoto: file })
  }

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>, active: boolean) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(active)
  }

  // Remove selected file
  const handleRemoveFile = () => {
    setPreviewUrl(null)
    updateFormData({ userPhoto: null })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // Validate and submit form
  const handleSubmit = () => {
    if (!formData.userPhoto) {
      setError("Please upload your photo")
      return
    }

    setError(null)
    onSubmit()
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-2">Photo</h2>
      <p className="text-sm text-gray-500 mb-6">Please upload your photo for completing your KYC step.</p>

      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        } ${error ? "border-red-500" : ""}`}
        onDragOver={(e) => handleDrag(e, true)}
        onDragEnter={(e) => handleDrag(e, true)}
        onDragLeave={(e) => handleDrag(e, false)}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="relative">
            <Image
              src={previewUrl || "/placeholder.svg"}
              alt="User Photo"
              width={200}
              height={200}
              className="mx-auto object-contain max-h-48 rounded-full"
            />
            <button
              onClick={handleRemoveFile}
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="py-4">
            <div className="mb-4 flex justify-center">
              <Camera className="text-blue-500" size={40} />
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

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

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
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Finish & Submit
        </button>
      </div>
    </div>
  )
}

