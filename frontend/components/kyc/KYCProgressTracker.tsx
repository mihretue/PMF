import Image from 'next/image';

interface KYCProgressTrackerProps {
  steps: string[];
  currentStep: number;
}

export default function KYCProgressTracker({ steps, currentStep }: KYCProgressTrackerProps) {
  return (
    <div className="w-full px-4"> {/* Added padding to prevent edge clipping */}
      <div className="flex justify-between items-center relative">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center relative z-10 flex-1"> {/* Added flex-1 */}
            {/* Step indicator */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white">
              {index <= currentStep ? (
                <Image
                  src="/Check Mark.png"
                  alt="checked"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              ) : index === currentStep ? (
                <Image
                  src="/Not checked.png"
                  alt="current"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-gray-100" />
              )}
            </div>

            {/* Step label */}
            <div className={`text-xs mt-2 text-center ${index <= currentStep ? 'font-medium' : 'text-gray-500'}`}>
              {step}
            </div>

            {/* Connector line - only between steps and not after last */}
            {index < steps.length - 1 && (
              <div className="absolute top-4  left-1 h-0.5 w-[calc(100%)]">
                <div className={`h-full w-full ${index < currentStep ? 'bg-green-500' : 'bg-gray-300'}`} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}