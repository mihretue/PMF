"use client"

import { useState } from "react"
import { Box, Container, Typography, Stack, Paper, Grid, InputAdornment, styled } from "@mui/material"
import { ChevronRight } from "@mui/icons-material"


// Custom styled components
const GradientText = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(to right, #00FA91, #3682AF)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  color: "transparent",
}))

const FooterGradient = styled(Box)(({ theme }) => ({
  background: "linear-gradient(to right, #00FA91, #3682AF)",
  padding: theme.spacing(6, 0),
}))

const LogoCircle = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: "50%",
  border: `2px solid ${theme.palette.primary.main}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.primary.main,
}))

const CurrencyCard = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  borderRadius: 16,
  padding: theme.spacing(3),
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
}))

const FlagIcon = styled(Box)(({ theme }) => ({
  width: 24,
  height: 16,
  borderRadius: 4,
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: theme.spacing(1),
}))

export default function Home() {
  const [sendAmount, setSendAmount] = useState("1,000")
  const [receiveAmount, setReceiveAmount] = useState("131,449.00")

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Navigation */}
      <Container sx={{ py: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 6 }}>
            <LogoCircle>
              <Typography variant="body1" fontWeight="bold">
                $
              </Typography>
            </LogoCircle>
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4 }}>
              <Typography variant="body1" fontWeight="medium">
                Home
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                About
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                Services
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                Portfolio
              </Typography>
            </Box>
          </Box>
         
        </Box>
      </Container>

      {/* Hero Section */}
      <Container sx={{ py: 6 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <GradientText variant="h3" mb={3}>
              PROUDLY CONNECTING ETHIOPIA TO THE WORLD
            </GradientText>
            <Typography variant="body1" mb={4} color="text.secondary" maxWidth="lg">
              Experience fast and efficient currency services customized to your needs. Join us today!
            </Typography>
          
          </Grid>

         
        </Grid>
      </Container>

      {/* Footer */}
      <FooterGradient sx={{ mt: "auto" }}>
        <Container>
          <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6, opacity: 0.5 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 128,
                    height: 32,
                    bgcolor: "rgba(128, 128, 128, 0.2)",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                  }}
                >
                  Logoipsum
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </FooterGradient>
    </Box>
  )
}

