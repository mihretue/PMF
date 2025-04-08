import React from 'react'
import {
  CheckCircle,
  DollarSign,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitter,
} from "lucide-react"
import Link from 'next/link'

function Footer() {
  return (
    <div>
         <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-sm text-gray-500">© {new Date().getFullYear()} All rights reserved</div>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </Link>
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </Link>
              <Link href="#" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer