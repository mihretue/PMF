import OtpVerificationForm from "@/components/otp-verification-form";
import { Suspense } from "react";

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-center min-h-screen">
        <Suspense>
          <OtpVerificationForm />
        </Suspense>{" "}
      </div>
    </div>
  );
}
