"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  InputAdornment,
  useMediaQuery,
  useTheme,
  styled,
  Grid,
} from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";


const GradientText = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(to right, #00E88F, #1973A5)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  color: "transparent",
}));

const FlagIcon = styled(Box)(({ theme }) => ({
  width: 24,
  height: 16,
  borderRadius: 4,
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: theme.spacing(1),
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
          py: 4,
          px: 4,
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
          <ConverterWrapper >
            <CurrencyCard sx={{ bgcolor: "rgba(154, 194, 215, 0.49)" ,fontFamily: 'Montserrat',margin:'20px' }} >
              <Stack spacing={3}>
              <Box>
                <Typography variant="body1" fontWeight="medium" mb={1} fontFamily= 'Montserrat'>
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
                <Typography variant="body1" fontWeight="medium" mb={1} fontFamily= 'Montserrat'>
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
                    <Typography variant="body2" fontWeight="medium" fontFamily= 'Montserrat'>
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
                <Typography variant="body1" fontWeight="medium" mb={1} fontFamily= 'Montserrat'>
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
                  <Typography variant="body1" fontWeight="medium" fontFamily= 'Montserrat'>
                  Connected bank account (ACH)
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", color: "primary.main", fontFamily: 'Montserrat' }}>
                  <Typography variant="body2">Change</Typography>
                  <ChevronRight fontSize="small" />
                </Box>
                </Paper>
              </Box>

              <Stack spacing={1}>
                <Box sx={{ display: "flex", justifyContent: "space-between", fontFamily: 'Montserrat'  }}>
                <Typography variant="body2">Connected bank account (ACH) fee</Typography>
                <Typography variant="body2" fontWeight="medium">
                  1.70 USD
                </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" , fontFamily: 'Montserrat' }}>
                <Typography variant="body2">Our fee</Typography>
                <Typography variant="body2" fontWeight="medium">
                  3.78 USD
                </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" , fontFamily: 'Montserrat' }}>
                <Typography variant="body2" fontWeight="medium">
                  Total included fees (0.55%)
                </Typography>
                <Typography variant="body2" fontWeight="medium" fontFamily= 'Montserrat' >
                  5.48 USD
                </Typography>
                </Box>
              </Stack>

              <Stack spacing={0.5}>
                <Typography variant="body2" fontFamily= 'Montserrat' >You could save up to 41.45 USD</Typography>
                <Typography variant="body2" fontFamily= 'Montserrat'>
                Should arrive{" "}
                <Box component="span" fontWeight="medium" fontFamily= 'Montserrat'>
                  in 3 hours
                </Box>
                </Typography>
              </Stack>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '50%' }}>
                <Button variant="outlined" fullWidth sx={{ fontFamily: 'Montserrat' }}>
                  Compare fees
                </Button>
                </div>
                <div style={{ width: '50%' }}>
                <Button fullWidth sx={{ fontFamily: 'Montserrat' }}>Send money</Button>
                </div>
              </div>
              </Stack>
            </CurrencyCard>
          </ConverterWrapper>
        </HeroSection>
      </Container>
    </div>
  )
}

export default Hero