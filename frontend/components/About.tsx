"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Box,
  Container,
  Typography,

} from "@mui/material"
import { Button } from "@/components/ui/button"



function About() {
  return (
    <div>
        <section className="py-16">
                  <div className="container mx-auto px-4">
                    <div className="grid gap-8 md:grid-cols-2">
                      <div className="relative h-64 md:h-auto">
                        <div className="absolute left-0 top-0 h-48 w-48 translate-x-4 translate-y-4 transform rounded-lg bg-gray-200">
                          <Image
                            src={"/assets/dolars.png"}
                            alt="Money transfer"
                            width={200}
                            height={200}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="absolute bottom-0 right-0 h-48 w-48 -translate-x-4 -translate-y-4 transform rounded-lg bg-gray-200">
                          <Image
                            src="/assets/stack2.png"
                            alt="Credit card"
                            width={192}
                            height={192}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <h2 className="mb-4 text-3xl font-bold">About Pay Me Fees</h2>
                        <h3 className="mb-2 text-xl font-semibold">Fast Transactions</h3>
                        <p className="mb-6 text-gray-600">
                          Pay Me has the lowest fees and best exchange rates. Our service is fast and reliable, ensuring your
                          money reaches its destination quickly and securely.
                        </p>
                        <Button variant="outlined" className="border-teal-400 text-teal-400 hover:bg-teal-50">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                </section>
    </div>
  )
}

export default About