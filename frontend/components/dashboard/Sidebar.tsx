"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { LayoutDashboard, ArrowLeftRight, MessageSquare, User, Settings, HelpCircle, LogOut, X } from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  // Get current pathname for active link detection
  const pathname = usePathname()

  // Handle responsive behavior
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Close sidebar when clicking outside on mobile
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (isMounted && isOpen && !target.closest("[data-sidebar]") && !target.closest("[data-sidebar-toggle]")) {
        onClose()
      }
    }

    // Close sidebar when pressing escape key
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    document.addEventListener("keydown", handleEscKey)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isMounted, isOpen, onClose])

  // Handle body scroll when sidebar is open on mobile
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isOpen) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = ""
      }
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Define navigation items
  const navItems = [
    { icon: <LayoutDashboard size={20} />, text: "Dashboard", href: "/admin/dashboard" },
    { icon: <ArrowLeftRight size={20} />, text: "Transactions", href: "/admin/transactions" },
    { icon: <ArrowLeftRight size={20} />, text: "Exchange rate", href: "/exchange-rate" },
    { icon: <MessageSquare size={20} />, text: "Messages", href: "/messages" },
    { icon: <User size={20} />, text: "Profile", href: "/profile" },
    { icon: <Settings size={20} />, text: "Settings", href: "/settings" },
    { icon: <HelpCircle size={20} />, text: "Help Center", href: "/help" },
    { icon: <LogOut size={20} />, text: "Logout", href: "/logout" },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-[#584a4a] bg-opacity-50 z-20 lg:hidden" />}

      {/* Sidebar */}
      <div
        data-sidebar
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Logo and close button */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center justify-center gap-1">
              <Image src="/logo.png" alt="Logo" width={50} height={50} /><span className="text-md font-bold">Pay My Fee</span>
            </div>

            <button onClick={onClose} className="lg:hidden p-1 rounded-full hover:bg-gray-100">
              <X size={25} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 flex-1">
            {navItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                text={item.text}
                href={item.href}
                active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
              />
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}

interface SidebarItemProps {
  icon: React.ReactNode
  text: string
  href: string
  active: boolean
}

function SidebarItem({ icon, text, href, active }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-2 text-sm rounded-lg ${
        active ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span>{text}</span>
    </Link>
  )
}

