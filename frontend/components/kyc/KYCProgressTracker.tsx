import { Check, Circle } from "lucide-react"

interface KYCProgressTrackerProps {
  steps: string[]
  currentStep: number
}

export default function KYCProgressTracker({ steps, currentStep }: KYCProgressTrackerProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center relative">
            {/* Step indicator */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center z-10 
                ${
                  index < currentStep
                    ? "bg-green-500 text-white"
                    : index === currentStep
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 border-2 border-gray-300"
                }`}
            >
              {index < currentStep ? (
                <Check size={16} />
              ) : (
                <Circle
                  size={16}
                  className={index === currentStep ? "text-white" : "text-gray-400"}
                  fill={index === currentStep ? "white" : "none"}
                />
              )}
            </div>

            {/* Step label */}
            <div 
              className={`text-xs mt-2 text-center 
                ${index <= currentStep ? "font-medium" : "text-gray-500"}`}
            >
              {step}
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute top-4 left-8 h-0.5 w-full 
                  ${index < currentStep ? "bg-green-500" : "bg-gray-300"}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}