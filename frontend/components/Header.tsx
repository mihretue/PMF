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


export default function Header() {
    return (
    <header>
    <Container
          maxWidth={false}
          disableGutters={true} // Removes default padding/margins
          sx={{
            py: 2,
            px:6,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            backgroundColor: "white",
            zIndex: 1000,
          }}
        >
          {/* Add padding inside the Box instead */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 6, // Padding applied here instead
            }}
          >
            {/* Left Side: Logo and Navigation */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Image src={"/logo.png"} alt="Logo" width={40} height={50} className="h-full w-full object-cover" />
              {/* Navigation Links (Hidden on Small Screens) */}
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4 }}>
                {["Home", "About", "Services", "Contact"].map((text) => (
                  <Typography key={text} variant="body1" fontWeight="medium" fontFamily="Montserrat">
                    {text}
                  </Typography>
                ))}
              </Box>
            </Box>
    
            {/* Right Side: Login Button */}
            <Link href="/login" passHref>
              <Button variant="contained" 
              >
                Get Started
              </Button>
            </Link>
          </Box>
        </Container>
        </header>


)}
