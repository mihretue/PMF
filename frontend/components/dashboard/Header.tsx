"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Bell, ChevronDown, Menu } from "lucide-react"
import Image from "next/image"

interface HeaderProps {
  onToggleSidebar: () => void
  user: {
    name: string
    email: string
    avatar?: string
  }
}

interface Notification {
  id: string
  user: string
  message: string
  time: string
  read: boolean
}

export default function Header({ onToggleSidebar, user }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      user: "John Doe",
      message: "New transaction is requested. Click to see the detail",
      time: "28m",
      read: false,
    },
    {
      id: "2",
      user: "Abebe Bikila",
      message: "New transaction is requested. Click to see the detail",
      time: "8h",
      read: false,
    },
    {
      id: "3",
      user: "John Doe",
      message: "New transaction is requested. Click to see the detail",
      time: "28s",
      read: false,
    },
    {
      id: "4",
      user: "Drink Water",
      message: "New transaction is requested. Click to see the detail",
      time: "2d",
      read: true,
    },
    {
      id: "5",
      user: "Markus Rashford",
      message: "New transaction is requested. Click to see the detail",
      time: "2d",
      read: true,
    },
    {
      id: "6",
      user: "Drink Water",
      message: "New transaction is requested. Click to see the detail",
      time: "2d",
      read: true,
    },
    {
      id: "7",
      user: "Smith Rowe",
      message: "New transaction is requested. Click to see the detail",
      time: "2d",
      read: true,
    },
    {
      id: "8",
      user: "Bukayo Saka",
      message: "New transaction is requested. Click to see the detail",
      time: "2d",
      read: true,
    },
  ])

  const userMenuRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const languageMenuRef = useRef<HTMLDivElement>(null)

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 md:py-4 md:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Hamburger menu for mobile */}
          <button
            onClick={onToggleSidebar}
            className="mr-4 p-2 rounded-md hover:bg-gray-100 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>

          {/* Search bar - hidden on smallest screens */}
          <div className="hidden sm:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 md:w-64"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Exchange Rate button - responsive text */}
          <button className="px-2 py-1 md:px-4 md:py-1.5 border border-blue-400 text-blue-500 rounded-full text-xs md:text-sm whitespace-nowrap">
            <span className="hidden sm:inline">Exchange Rate</span>
            <span className="sm:hidden">Ex Rate</span>
          </button>

          {/* Language selector */}
          <div ref={languageMenuRef} className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center border border-gray-300 rounded-full px-2 py-1 md:px-3 md:py-1"
            >
              <span className="mr-1">🇬🇧</span>
              <span className="mr-1 text-xs md:text-sm">En</span>
              <ChevronDown size={16} />
            </button>

            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-10">
                <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                  <span className="mr-2">🇬🇧</span> English
                </button>
                <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                  <span className="mr-2">🇪🇹</span> Amharic
                </button>
                <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                  <span className="mr-2">🇫🇷</span> French
                </button>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div ref={notificationsRef} className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-1">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-blue-50 rounded-md shadow-lg overflow-hidden z-10">
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start px-4 py-3 border-b border-blue-100 hover:bg-blue-100 cursor-pointer"
                    >
                      <div className="flex-shrink-0 mr-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                                stroke="black"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                                stroke="black"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <span
                            className={`absolute top-0 left-0 w-3 h-3 ${notification.read ? "bg-green-500" : "bg-purple-500"} rounded-full`}
                          ></span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{notification.user}</p>
                          <p className="text-xs text-gray-500">{notification.time}</p>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User profile */}
          <div ref={userMenuRef} className="relative">
            <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                {user.avatar ? (
                  <Image
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-medium">
                    AB
                  </div>
                )}
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-pink-50 rounded-lg shadow-lg overflow-hidden z-10">
                <div className="p-4 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-purple-100 mb-2 relative">
                    {user.avatar ? (
                      <Image
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 text-2xl font-medium">
                        AB
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-black rounded-full flex items-center justify-center text-white">
                      <span className="text-xl">+</span>
                    </div>
                  </div>
                  <h3 className="text-base font-medium">{user.name}</h3>

                  <div className="w-full mt-4 space-y-2 text-blue-600">
                    <button className="w-full text-left text-sm hover:underline">Change Password</button>
                    <button className="w-full text-left text-sm hover:underline">Settings</button>
                    <button className="w-full mt-2 border border-blue-400 rounded-md py-2 text-center text-sm hover:bg-blue-100 transition-colors">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search - only visible on smallest screens */}
      <div className="mt-3 sm:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
          />
        </div>
      </div>
    </header>
  )
}

