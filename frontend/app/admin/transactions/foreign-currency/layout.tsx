import type React from "react"
import LayoutWrapper from "@/components/dashboard/LayoutWrapper"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <LayoutWrapper>{children}</LayoutWrapper>
}

