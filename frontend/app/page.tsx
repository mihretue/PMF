"use client"

import { useState } from "react"
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  Grid,
  InputAdornment,
  useMediaQuery,
  useTheme,
  styled,
} from "@mui/material"
import { ChevronRight } from "@mui/icons-material"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Custom styled components
const GradientText = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(to right, #00E88F, #1973A5)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  color: "transparent",
}))

const FooterGradient = styled(Box)(({ theme }) => ({
  background: "linear-gradient(to right, #9fe870, #1973A5)",
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
  height: "100%",
  display: "flex",
  flexDirection: "column",
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

const HeroSection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
    alignItems: "center",
  },
  gap: theme.spacing(6),
  width: "100%",
}))

const HeroContent = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
}))

const ConverterWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  width: "100%",
}))

export default function Home() {
  const [sendAmount, setSendAmount] = useState("1,000")
  const [receiveAmount, setReceiveAmount] = useState("131,449.00")
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

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
          <Button>Get Started</Button>
        </Box>
      </Container>

      {/* Hero Section - Now with flex layout */}
      <Container sx={{ py: 6, flex: 1, display: "flex" }}>
        <HeroSection>
          <HeroContent>
            <GradientText
              variant={isMobile ? "h2" : "h3"}
              fontWeight="regular"
              mb={3}
              sx={{
                fontSize: {
                  xs: "2.5rem",
                  sm: "3rem",
                  md: "3.5rem",
                  lg: "4rem",
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
                maxWidth: "600px",
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
              Experience fast and efficient currency services customized to your needs. Join us today!
            </Typography>
            <Box>
              <Button size={isMobile ? "medium" : "large"}>Get Started</Button>
            </Box>
          </HeroContent>

          {/* Currency Converter Card */}
          <ConverterWrapper >
            <CurrencyCard sx={{ bgcolor: "white" }} >
              <Stack spacing={3}>
                <Box>
                  <Typography variant="body1" fontWeight="medium" mb={1}>
                    You send exactly
                  </Typography>
                  <Input
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    InputProps={{
                      sx: { bgcolor: "rgba(255, 255, 255, 0.7)" },
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          sx={{
                            borderLeft: "1px solid #e0e0e0",
                            ml: 1,
                            pl: 1,
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <FlagIcon sx={{ bgcolor: "blue.500" }}>🇦🇺</FlagIcon>
                            <Typography variant="body2" fontWeight="medium">
                              EUR
                            </Typography>
                            <ChevronRight fontSize="small" sx={{ ml: 0.5, color: "text.secondary" }} />
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body1" fontWeight="medium" mb={1}>
                    Recipient gets
                  </Typography>
                  <Input
                    value={receiveAmount}
                    onChange={(e) => setReceiveAmount(e.target.value)}
                    InputProps={{
                      sx: { bgcolor: "rgba(255, 255, 255, 0.7)" },
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          sx={{
                            borderLeft: "1px solid #e0e0e0",
                            ml: 1,
                            pl: 1,
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <FlagIcon sx={{ bgcolor: "green.500" }}>🇪🇹</FlagIcon>
                            <Typography variant="body2" fontWeight="medium">
                              ETB
                            </Typography>
                            <ChevronRight fontSize="small" sx={{ ml: 0.5, color: "text.secondary" }} />
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body1" fontWeight="medium" mb={1}>
                    Paying with
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      bgcolor: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor: "grey.100",
                          borderRadius: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="caption">🏦</Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="medium">
                        Connected bank account (ACH)
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", color: "primary.main" }}>
                      <Typography variant="body2">Change</Typography>
                      <ChevronRight fontSize="small" />
                    </Box>
                  </Paper>
                </Box>

                <Stack spacing={1}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2">Connected bank account (ACH) fee</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      1.70 USD
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2">Our fee</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      3.78 USD
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" fontWeight="medium">
                      Total included fees (0.55%)
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      5.48 USD
                    </Typography>
                  </Box>
                </Stack>

                <Stack spacing={0.5}>
                  <Typography variant="body2">You could save up to 41.45 USD</Typography>
                  <Typography variant="body2">
                    Should arrive{" "}
                    <Box component="span" fontWeight="medium">
                      in 3 hours
                    </Box>
                  </Typography>
                </Stack>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button variant="outlined" fullWidth>
                      Compare fees
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button fullWidth>Send money</Button>
                  </Grid>
                </Grid>
              </Stack>
            </CurrencyCard>
          </ConverterWrapper>
        </HeroSection>
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

