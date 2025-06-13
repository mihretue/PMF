"use client"

import { useState } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import { Home } from 'lucide-react'
import KYCProgressTracker from "@/components/kyc/KYCProgressTracker"
import PersonalInformationStep from "@/components/kyc/PersonalInformationStep"
import IDCardFrontStep from "@/components/kyc/IDCardFrontStep"
import IDCardBackStep from "@/components/kyc/IDCardBackStep"
import UserPhotoStep from "@/components/kyc/UserPhotoStep"
import KYCCompletedStep from "@/components/kyc/KYCCompletedStep"
import NotVerifiedBanner from "@/components/kyc/NotVerifiedBanner"

// Define the steps in the KYC process
const KYC_STEPS = [
  "Personal Information",
  "Id card front",
  "Id card back",
  "Your photo",
  "KYC Completed"
]

// Define the form data structure
export interface KYCFormData {
  firstName: string
  lastName: string
  dateOfBirth: string
  idType: string
  idFrontImage: File | null
  idBackImage: File | null
  userPhoto: File | null
  isVerified: boolean
}

export default function Kyc() {  // Changed from 'kyc' to 'Kyc'
//   const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<KYCFormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    idType: "",
    idFrontImage: null,
    idBackImage: null,
    userPhoto: null,
    isVerified: false
  })

  // Update form data
  const updateFormData = (data: Partial<KYCFormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  // Handle next step
  const handleNext = () => {
    if (currentStep < KYC_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Here you would integrate with your Django backend
      // Example:
      // const formDataToSend = new FormData();
      // formDataToSend.append('firstName', formData.firstName);
      // formDataToSend.append('lastName', formData.lastName);
      // formDataToSend.append('dateOfBirth', formData.dateOfBirth);
      // formDataToSend.append('idType', formData.idType);
      // if (formData.idFrontImage) formDataToSend.append('idFrontImage', formData.idFrontImage);
      // if (formData.idBackImage) formDataToSend.append('idBackImage', formData.idBackImage);
      // if (formData.userPhoto) formDataToSend.append('userPhoto', formData.userPhoto);
      
      // const response = await fetch('your-django-api/kyc', {
      //   method: 'POST',
      //   body: formDataToSend
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update verification status
      updateFormData({ isVerified: true })
      
      // Move to completed step
      setCurrentStep(4)
    } catch (error) {
      console.error("KYC submission error:", error)
    }
  }

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInformationStep 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={handleNext} 
          />
        )
      case 1:
        return (
          <IDCardFrontStep 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={handleNext} 
            onPrevious={handlePrevious} 
          />
        )
      case 2:
        return (
          <IDCardBackStep 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={handleNext} 
            onPrevious={handlePrevious} 
          />
        )
      case 3:
        return (
          <UserPhotoStep 
            formData={formData} 
            updateFormData={updateFormData} 
            onSubmit={handleSubmit} 
            onPrevious={handlePrevious} 
          />
        )
      case 4:
        return <KYCCompletedStep />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification banner */}
      {!formData.isVerified && <NotVerifiedBanner />}
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        {/* Progress tracker */}
        <KYCProgressTracker steps={KYC_STEPS} currentStep={currentStep} />
        
        {/* Step content */}
        <div className="mt-8">
          {renderStep()}
        </div>
      </div>
    </div>
  )
}