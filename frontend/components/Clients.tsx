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

function Clients() {
  return (
    <div>
         <section className="py-16">
                  <div className="container px-6 md:px-12 lg:px-20 mx-auto px-4 ">
                    <h2 className="mb-12 text-center text-3xl font-bold">Our Clients</h2>
                    <div className="mb-8 flex flex-wrap items-center justify-center gap-8">
                      <div className="flex items-center text-gray-500">
                        <Globe className="mr-2 h-5 w-5" />
                        <span className="text-sm">Global Partners</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        <span className="text-sm">International Certified</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <DollarSign className="mr-2 h-5 w-5" />
                        <span className="text-sm">Best Exchange Rates</span>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-lg bg-gray-100 p-6">
                        <h3 className="mb-2 text-3xl font-bold">1000+</h3>
                        <p className="text-gray-600">Successful Transactions</p>
                        <p className="mt-2 text-sm text-gray-500">
                          We have successfully processed over 1000 transactions with 100% satisfaction rate
                        </p>
                      </div>
                      <div className="rounded-lg bg-gray-100 p-6">
                        <h3 className="mb-2 text-3xl font-bold">500+</h3>
                        <p className="text-gray-600">Happy Clients</p>
                        <p className="mt-2 text-sm text-gray-500">Over 500 clients trust us with their money transfer needs</p>
                      </div>
                      <div className="rounded-lg bg-gray-100 p-6">
                        <h3 className="mb-2 text-3xl font-bold">3000+</h3>
                        <p className="text-gray-600">Customer Support Hours</p>
                        <p className="mt-2 text-sm text-gray-500">We've spent over 3000 hours helping our clients</p>
                      </div>
                    </div>
                  </div>
                </section>
    </div>
  )
}

export default Clients