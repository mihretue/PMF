"use client"

import { useState } from "react"
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  InputAdornment,
  useMediaQuery,
  useTheme,
  styled,
  TextareaAutosize,
} from "@mui/material"
import Grid from "@mui/material/Grid"
import { ChevronRight } from "@mui/icons-material"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
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
import Image from "next/image"

function Services() {
  return (
    <div>
         <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">Our Finance Services</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              <div className="lg:h-[200px] p-6  bg-gradient-to-r from-[rgba(0,250,145,0.5)] to-[rgba(54,130,175,0.5)] " >
                <h3 className="mb-2 text-xl font-semibold opacity-100">Foreign Currency</h3>
                <p className="text-gray-600 opacity-100">Get your desired currency quickly and easily.</p>
              </div>
              <div className="lg:h-[200px] p-6  bg-gradient-to-r from-[rgba(0,250,145,0.5)] to-[rgba(54,130,175,0.5)]">
                <h3 className="mb-2 text-xl font-semibold">Send Money</h3>
                <p className="text-gray-600">Transfer funds quickly to your loved ones.</p>
              </div>
              <div className="lg:h-[200px] p-6  bg-gradient-to-r from-[rgba(0,250,145,0.5)] to-[rgba(54,130,175,0.5)] to-">
                <h3 className="mb-2 text-xl font-semibold">Transaction History</h3>
                <p className="text-gray-600">Track your transactions anytime, effortlessly.</p>
              </div>
              <div className="lg:h-[200px] p-6  bg-gradient-to-r from-[rgba(0,250,145,0.5)] to-[rgba(54,130,175,1)]">
                <h3 className="mb-2 text-xl font-semibold">Exchange Rates</h3>
                <p className="text-gray-600">Get the best currency rates at your fingertips.</p>
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <Button className="bg-teal-400 hover:bg-teal-500">View More</Button>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="mb-4 text-3xl font-bold">
                  Key Features of
                  <br />
                  Our Service
                </h2>
                <p className="mb-6 text-gray-600">
                  We provide a comprehensive solution to meet your currency needs affordably.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-teal-400" />
                    <span>Quick Transactions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-teal-400" />
                    <span>Secure Money Transfers</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-teal-400" />
                    <span>Instant currency exchange for USD to ETB needs</span>
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/assets/exchange.png"
                  alt="Financial technology"
                  width={400}
                  height={300}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>
    </div>
  )
}

export default Services