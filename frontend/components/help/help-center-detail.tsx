"use client";

import type React from "react";


import {
  Box,
  List,
  ListItem,
  Typography,
  
} from "@mui/material";
import Image from "next/image";

function HelpCenterDetail() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Box>
      <Image src={"/help-center.png"} alt="Help Center" width={800} height={566} />
        <Box sx={{ maxWidth: "800px", textAlign: "center" }}>
          <Typography variant="h5" fontWeight={600} mb={2}>
            How to use PMF
          </Typography>

          <Typography variant="body1" mb={3} color="text.primary">
            Welcome to our help page! Here, you&apos;ll find all the information you need to get the most out of our
            product. Follow the steps below to get started:
          </Typography>

          <List sx={{ listStyleType: "decimal", pl: 4, textAlign: "left" }}>
            <ListItem sx={{ display: "list-item", pl: 1, pb: 2 }}>
              <Typography variant="body1" fontWeight={500}>
                Getting Started: Learn how to set up your account and navigate through the main features.
              </Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item", pl: 1, pb: 2 }}>
              <Typography variant="body1" fontWeight={500}>
                Using the Dashboard: Understand how to customize your dashboard and access key functionalities.
              </Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item", pl: 1, pb: 2 }}>
              <Typography variant="body1" fontWeight={500}>
                Troubleshooting: Find solutions to common issues and learn how to contact support for further assistance.
              </Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item", pl: 1, pb: 2 }}>
              <Typography variant="body1" fontWeight={500}>
                FAQs: Browse through frequently asked questions to quickly find answers to common queries.
              </Typography>
            </ListItem>
          </List>
        </Box>
        
      </Box>
    </div>
  );
}

export default HelpCenterDetail;