import React from 'react'
import { Button } from './ui/button'

function Contact() {
  return (
    <div>
         <section className="h-64 w-full bg-[url('/assets/background.png')] bg-cover bg-center  py-12">
                  <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                      <div>
                        <h2 className="text-2xl font-bold text-white">Contact Us</h2>
                        <p className="text-white/80">Reach out for assistance or inquiries regarding our services anytime</p>
                      </div>
                      <Button variant="outlined">Get In Touch</Button>
                    </div>
                  </div>
                </section>
    </div>
  )
}

export default Contact