import SetupNewPasswordForm from "@/components/SetupNewPasswordForm"

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-center min-h-screen">
        <SetupNewPasswordForm token={params.token} />
      </div>
    </div>
  )
}

