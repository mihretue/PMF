"use client"

import type React from "react"

import { useState } from "react"
import {
  Box,
  Typography,
  InputBase,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Breadcrumbs,
  Link,
  Container,
} from "@mui/material"
import { styled, alpha } from "@mui/material/styles"
import {
  Search as SearchIcon,

  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material"





const HelpSearchWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  marginBottom: theme.spacing(6),
  width: "100%",
  maxWidth: "600px",
  margin: "0 auto",
}))

const HelpSearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}))

const HelpStyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(2),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    fontSize: "1.1rem",
  },
}))



export default function HelpCenter() {
  const [expandedFaq, setExpandedFaq] = useState<string | false>("panel2")

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedFaq(isExpanded ? panel : false)
  }

  const faqs = [
    { id: "panel0", question: "Current Exchange rate ?", answer: "" },
    { id: "panel1", question: "Current Exchange rate ?", answer: "" },
    {
      id: "panel2",
      question: "Current Exchange rate ?",
      answer:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    },
    { id: "panel3", question: "Current Exchange rate ?", answer: "" },
  ]

  return (
     <>
        {/* Breadcrumb */}
        <Box sx={{ px: 3, py: 2 }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <Link underline="hover" color="#3a5d89" href="/">
              Home
            </Link>
            <Typography color="#646464">Help Center</Typography>
          </Breadcrumbs>
        </Box>

    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#fafafc" }}>
      

        {/* Main Content */}
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" align="center" fontWeight="bold" sx={{ mb: 4 }}>
            Hi. How Can We Help?
          </Typography>

          {/* Search Bar */}
          <HelpSearchWrapper>
            <HelpSearchIconWrapper>
              <SearchIcon />
            </HelpSearchIconWrapper>
            <HelpStyledInputBase placeholder="Search questions, keywords, topics" />
          </HelpSearchWrapper>


          {/* FAQ Section */}
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
              FAQ
            </Typography>

            <Box sx={{ mt: 2 }}>
              {faqs.map((faq) => (
                <Accordion
                  key={faq.id}
                  expanded={expandedFaq === faq.id}
                  onChange={handleAccordionChange(faq.id)}
                  sx={{
                    mb: 2,
                    boxShadow: "none",
                    border: "1px solid #e4e4e4",
                    borderRadius: "8px !important",
                    "&:before": {
                      display: "none",
                    },
                    "&.Mui-expanded": {
                      margin: "0 0 16px 0",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={expandedFaq === faq.id ? <ArrowUpIcon /> : <ArrowDownIcon />}
                    sx={{
                      borderRadius: "8px",
                      "&.Mui-expanded": {
                        borderBottom: faq.answer ? "1px solid #e4e4e4" : "none",
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                      },
                    }}
                  >
                    <Typography fontWeight={500}>{faq.question}</Typography>
                  </AccordionSummary>
                  {faq.answer && (
                    <AccordionDetails>
                      <Typography color="#646464">{faq.answer}</Typography>
                    </AccordionDetails>
                  )}
                </Accordion>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
      </>
  )
}
