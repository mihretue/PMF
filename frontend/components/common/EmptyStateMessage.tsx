import React from "react";
import { Box, Typography,  } from "@mui/material";

type NoTicketsMessageProps = {
  message: string; // Typing the 'message' prop as a string
  width?: string;
};

const EmptyStateMessage: React.FC<NoTicketsMessageProps> = ({ message, width }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="30vh"
      width={width || "100%"}  // Use width prop or default to "100%"
      bgcolor="#e3e9ef"
      color="text.primary"
      sx={{marginTop: {xs: '10px', sm: '20px', lg: '30px'}}}
      paddingY={2}
      borderRadius={5}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
          // color: "primary.main",
          textAlign: "center",
          fontSize: {
            xs: "1rem", // Font size for extra-small screens
            sm: "1rem", // Font size for small screens
            md: "1.2rem", // Font size for medium screens
            // lg: "1.5rem", // Font size for large screens
            // xl: "2rem", // Font size for extra-large screens
          },
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default EmptyStateMessage;
