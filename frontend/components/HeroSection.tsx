"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
  styled,

} from "@mui/material";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import CurrencyConverterCard from "./exchange/CurrencyConverterCard";


const GradientText = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(to right, #00E88F, #1973A5)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  color: "transparent",
}));


const HeroSection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
    alignItems: "center",
  },
  gap: theme.spacing(6),
  width: "100%",
}));

const HeroContent = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center", 
  textAlign: "center", 
  [theme.breakpoints.up("md")]: {
    alignItems: "flex-start",
    textAlign: "left",
  },
  padding: theme.spacing(2), 
}));

const ConverterWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  width: "100%",
}));

const CurrencyCard = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  borderRadius: 16,
  padding: theme.spacing(3),
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));

function Hero() {
  const [sendAmount, setSendAmount] = useState("1,000");
  const [receiveAmount, setReceiveAmount] = useState("131,449.00");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <div id="home" >
      <Container
        disableGutters
        sx={{
          py: 5,
          px: 2.9,
          mt: 4,
          display: "flex",
        }}
      >
        <HeroSection>
          {/* Hero Content */}
          <HeroContent>
            <GradientText
              variant={isMobile ? "h4" : "h3"}
              fontWeight="regular"
              mb={3}
              sx={{
                fontSize: {
                  xs: "2.5rem",
                  sm: "3rem",
                  md: "3.5rem",
                  lg: "62px",
                },
                fontFamily: "Montserrat",
                fontStyle: "normal",
                fontWeight: 540,
                lineHeight: {
                  xs: "50px",  
                  sm: "60px",
                  md: "72px",
                },
            
                letterSpacing: {
                  xs: "-1px",  
                  sm: "-2px",
                  md: "-3px",
                },
                
              }}
            >
              PROUDLY CONNECTING ETHIOPIA TO THE WORLD
            </GradientText>

            <Typography
              variant="body1"
              mb={4}
              color="text.secondary"
              sx={{
                maxWidth: "500px",
                fontSize: { xs: "1rem", md: "1.1rem" },
                fontFamily: "Montserrat",
              }}
            >
              Experience fast and efficient currency services customized to your needs. Join us today!
            </Typography>

            <Box>
              <Link href="/login">
                <Button size={isMobile ? "medium" : "large"}>Get Started</Button>
              </Link>
            </Box>
          </HeroContent>

          {/* Currency Converter Card */}
          <CurrencyConverterCard/>
        </HeroSection>
      </Container>
    </div>
  )
}

export default Hero