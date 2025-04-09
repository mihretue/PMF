"use client"

import {
  Box,
} from "@mui/material"

import Header from "@/components/Header"
import Hero from "@/components/HeroSection"
import About from "@/components/About"
import Services from "@/components/Services"
import StatsCard from "@/components/StatsCard"
import Clients from "@/components/Clients"
import Contact from "@/components/Contact"
import Partners from "@/components/Partners"
import SocialMedias from "@/components/SocialMedias"
import Consultation from "@/components/Consultation"
import Footer from "@/components/Footer"




export default function Home() {


  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh"  }}>
       <Header/>
       <Hero/>
      
      {/* Partner */}
      <Partners/>
     
      {/* About Fees */}
      <About/>

      {/* Finance Services */}
      <Services/>

      {/* Stats Cards */}
      <StatsCard/>

      {/* Clients */}
      <Clients/>
      
      {/* Contact Us */}
      <Contact/>

      {/* Social Media */}
      <SocialMedias/>
      
      {/* Free Consultation */}
      <Consultation/>

      {/* Footer */}
      <Footer/>
        
       
    </Box>
  )
}

