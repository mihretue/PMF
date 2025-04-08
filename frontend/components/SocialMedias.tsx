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
function SocialMedias() {
  return (
    <div>
         <section className="py-16">
                  <div className="container px-6 md:px-12 lg:px-20 mx-auto px-4 ">
                    <h2 className="mb-12 text-center text-3xl font-bold">Our Social media</h2>
                    <div className="grid gap-6 md:grid-cols-3">
                      <div className="flex items-start">
                        <Facebook className="mr-3 h-6 w-6 text-gray-400" />
                        <div>
                          <h3 className="font-semibold">Official Facebook page</h3>
                          <p className="text-sm text-gray-500">Follow us on Facebook for updates and promotions</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Instagram className="mr-3 h-6 w-6 text-gray-400" />
                        <div>
                          <h3 className="font-semibold">Fast transactions and promo</h3>
                          <p className="text-sm text-gray-500">Follow us on Instagram for exclusive deals</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Twitter className="mr-3 h-6 w-6 text-gray-400" />
                        <div>
                          <h3 className="font-semibold">The best guidance</h3>
                          <p className="text-sm text-gray-500">Follow us on Twitter for tips and guidance</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
    </div>
  )
}

export default SocialMedias