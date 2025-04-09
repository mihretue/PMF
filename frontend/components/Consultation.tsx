import React from 'react'
import {
  TextareaAutosize,
} from "@mui/material"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {

  Mail,
  MapPin,
  Phone,
 
} from "lucide-react"
function Consultation() {
  return (
    <div>
        <section className="py-16">
          <div className="container px-6 md:px-12 lg:px-20 mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">Free Consultation</h2>
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
              <div>
                <div className="mb-4 flex items-center">
                  <Phone className="mr-3 h-5 w-5 text-gray-400" />
                  <span>+251 116789</span>
                </div>
                <div className="mb-4 flex items-center">
                  <Mail className="mr-3 h-5 w-5 text-gray-400" />
                  <span>info@example.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-3 h-5 w-5 text-gray-400" />
                  <span>Addis Ababa, ET</span>
                </div>
              </div>
              <div>
                <form className="space-y-4">
                  <Input placeholder="Name" className="my-6" />
                  <Input placeholder="Email" className="my-6" />
                  <TextareaAutosize
                    minRows={3}
                    placeholder="Message"
                    style={{ width: '100%' ,border:"1px solid lightgray" , margin:'5px 0px' ,padding:'5px'}}
                  />
                  <Button className="w-full bg-teal-400 hover:bg-teal-500">Submit</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
    </div>
  )
}

export default Consultation