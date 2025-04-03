import React from 'react'

function StatsCard() {
  return (
    <div>
            <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex justify-end lg:h-[340px]">
            <div className="bg-gradient-to-r from-teal-100 to-teal-200 p-6 flex flex-col justify-end h-full">
              <h3 className="mb-2 text-lg font-semibold">Current Rates</h3>
              <p className="text-sm text-black-700">Get up-to-date rates for your currency needs</p>
            </div>
          </div>
    <div className="flex justify-end lg:h-[340px]">
              <div className=" bg-gradient-to-r from-teal-200 to-teal-300 p-6 flex flex-col justify-end h-full">
                <h3 className="mb-2 text-lg font-semibold">Personalized Matches</h3>
                <p className="text-sm text-black-700">Find solutions tailored to your specific needs</p>
              </div>
              </div>
              <div className="flex justify-end lg:h-[340px]">  
              <div className=" bg-gradient-to-r from-teal-300 to-teal-400 p-6 flex flex-col justify-end h-full">
                <h3 className="mb-2 text-lg font-semibold text-black">Customer Ratings</h3>
                <p className="text-sm text-black/80">See what our customers are saying about us</p>
              </div>
              </div>
              <div className="flex justify-end lg:h-[340px]">
              <div className=" bg-gradient-to-r from-teal-400 to-blue-300 p-6 flex flex-col justify-end h-full">
                <h3 className="mb-2 text-lg font-semibold text-black">User Feedback</h3>
                <p className="text-sm text-black/80">Your opinions help us improve our services</p>
              </div>
              </div>
            </div>
          </div>
        </section>
    </div>
  )
}

export default StatsCard