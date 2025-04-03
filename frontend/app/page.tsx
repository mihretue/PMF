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
import Link from "next/link"
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
import Image from "next/image"

// Custom styled components
const GradientText = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(to right, #00E88F, #1973A5)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  color: "transparent",
}))

const FooterGradient = styled(Box)(({ theme }) => ({
  background: "linear-gradient(270deg, rgba(0, 250, 145, 0.5) 0%, rgba(54, 130, 175, 0.5) 100%)",
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
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.09)",
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
      {/* About Fees */}
      <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="relative h-64 md:h-auto">
                <div className="absolute left-0 top-0 h-48 w-48 translate-x-4 translate-y-4 transform rounded-lg bg-gray-200">
                  <Image
                    src={"/assets/dolars.png"}
                    alt="Money transfer"
                    width={192}
                    height={192}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 h-48 w-48 -translate-x-4 -translate-y-4 transform rounded-lg bg-gray-200">
                  <Image
                    src="/assets/stack2.png"
                    alt="Credit card"
                    width={192}
                    height={192}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div>
                <h2 className="mb-4 text-3xl font-bold">About Pay Me Fees</h2>
                <h3 className="mb-2 text-xl font-semibold">Fast Transactions</h3>
                <p className="mb-6 text-gray-600">
                  Pay Me has the lowest fees and best exchange rates. Our service is fast and reliable, ensuring your
                  money reaches its destination quickly and securely.
                </p>
                <Button variant="outline" className="border-teal-400 text-teal-400 hover:bg-teal-50">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Finance Services */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">Our Finance Services</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              <div className="lg:h-[200px] p-6  bg-gradient-to-r from-[rgba(0,250,145,0.5)] to-[rgba(54,130,175,0.5)] " >
                <h3 className="mb-2 text-xl font-semibold opacity-100">Foreign Currency</h3>
                <p className="text-gray-600 opacity-100">Get your desired currency quickly and easily.</p>
              </div>
              <div className="lg:h-[200px] p-6  bg-gradient-to-r from-[rgba(0,250,145,0.5)] to-[rgba(54,130,175,0.5)]">
                <h3 className="mb-2 text-xl font-semibold">Send Money</h3>
                <p className="text-gray-600">Transfer funds quickly to your loved ones.</p>
              </div>
              <div className="lg:h-[200px] p-6  bg-gradient-to-r from-[rgba(0,250,145,0.5)] to-[rgba(54,130,175,0.5)] to-">
                <h3 className="mb-2 text-xl font-semibold">Transaction History</h3>
                <p className="text-gray-600">Track your transactions anytime, effortlessly.</p>
              </div>
              <div className="lg:h-[200px] p-6  bg-gradient-to-r from-[rgba(0,250,145,0.5)] to-[rgba(54,130,175,1)]">
                <h3 className="mb-2 text-xl font-semibold">Exchange Rates</h3>
                <p className="text-gray-600">Get the best currency rates at your fingertips.</p>
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <Button className="bg-teal-400 hover:bg-teal-500">View More</Button>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="mb-4 text-3xl font-bold">
                  Key Features of
                  <br />
                  Our Service
                </h2>
                <p className="mb-6 text-gray-600">
                  We provide a comprehensive solution to meet your currency needs affordably.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-teal-400" />
                    <span>Quick Transactions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-teal-400" />
                    <span>Secure Money Transfers</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-teal-400" />
                    <span>Instant currency exchange for USD to ETB needs</span>
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/assets/exchange.png"
                  alt="Financial technology"
                  width={400}
                  height={300}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className=" bg-gradient-to-r from-teal-100 to-teal-200 p-6">
                <h3 className="mb-2 text-lg font-semibold">Current Rates</h3>
                <p className="text-sm text-gray-700">Get up-to-date rates for your currency needs</p>
              </div>
              <div className=" bg-gradient-to-r from-teal-200 to-teal-300 p-6">
                <h3 className="mb-2 text-lg font-semibold">Personalized Matches</h3>
                <p className="text-sm text-gray-700">Find solutions tailored to your specific needs</p>
              </div>
              <div className=" bg-gradient-to-r from-teal-300 to-teal-400 p-6">
                <h3 className="mb-2 text-lg font-semibold text-white">Customer Ratings</h3>
                <p className="text-sm text-white/80">See what our customers are saying about us</p>
              </div>
              <div className="lg:h-[340px] bg-gradient-to-r from-teal-400 to-blue-300 p-6">
                <h3 className="mb-2 text-lg font-semibold text-white">User Feedback</h3>
                <p className="text-sm text-white/80">Your opinions help us improve our services</p>
              </div>
            </div>
          </div>
        </section>

        {/* Clients */}
        <section className="py-16">
          <div className="container mx-auto px-4">
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

        {/* Contact Us */}
        <section className="h-64 w-full bg-[url('/assets/background.png')] bg-cover bg-center  py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div>
                <h2 className="text-2xl font-bold text-white">Contact Us</h2>
                <p className="text-white/80">Let us know if you have any questions or concerns</p>
              </div>
              <Button className="bg-white text-teal-400 hover:bg-gray-100">Talk to Sales</Button>
            </div>
          </div>
        </section>

        {/* Social Media */}
        <section className="py-16">
          <div className="container mx-auto px-4">
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

        {/* Free Consultation */}
        <section className="py-16">
          <div className="container mx-auto px-4">
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
                  <Input placeholder="Name" />
                  <Input placeholder="Email" />
                  <Input placeholder="Phone" />
                  <Input placeholder="Message" />
                  <Button className="w-full bg-teal-400 hover:bg-teal-500">Submit</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
        <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-sm text-gray-500">© {new Date().getFullYear()} All rights reserved</div>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </Link>
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </Link>
              <Link href="#" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </Box>
  )
}

