"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          py: 2,
          px: 0,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "white",
          zIndex: 1000,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: "lg",
            mx: "auto",
            px: 4,
          }}
        >
          {/* Left Side: Logo and Desktop Nav */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Image
              src={"/logo.png"}
              alt="Logo"
              width={40}
              height={50}
              className="h-full w-full object-cover"
            />

            {/* Desktop Nav Links */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4 }}>
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href} passHref>
                  <Typography
                    component="a"
                    variant="body1"
                    fontWeight="medium"
                    fontFamily="Montserrat"
                    sx={{
                      cursor: "pointer",
                      textDecoration: "none",
                      color: "inherit",
                      "&:hover": {
                        color: "teal",
                      },
                    }}
                  >
                    {link.label}
                  </Typography>
                </Link>
              ))}
            </Box>
          </Box>

          {/* Right Side: Mobile Menu or Button */}
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}>
            <IconButton onClick={toggleDrawer(true)} size="large">
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Desktop Login Button */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Link href="/login" passHref>
              <Button variant="contained">Get Started</Button>
            </Link>
          </Box>
        </Box>

        {/* Mobile Drawer Menu */}
        <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
          <Box
            sx={{
              width: 250,
              padding: 2,
            }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton onClick={toggleDrawer(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <List>
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href} passHref>
                  <ListItem component="a">
                    <ListItemText primary={link.label} />
                  </ListItem>
                </Link>
              ))}
              
            </List>
          </Box>
        </Drawer>
      </Container>
    </header>
  );
}
