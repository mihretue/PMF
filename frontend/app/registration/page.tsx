import SignUpForm from "@/components/SignUpForm"

export default function registration() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-center min-h-screen">
        <SignUpForm />
      </div>
    </div>
  )
}

