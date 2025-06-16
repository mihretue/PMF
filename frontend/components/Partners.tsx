import React from 'react'
import {
  Box,
  Container,
  styled,
 
} from "@mui/material"

const FooterGradient = styled(Box)(({ theme }) => ({
  background: "linear-gradient(270deg,  rgba(54, 130, 175, 0.5) 0% , rgba(0, 250, 145, 0.5) 100%)",
  // backgroundColor:"#F3F4F6",
  padding: theme.spacing(6, 0),
}))


function Partners() {
  return (
    <div>
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
    </div>
  )
}

export default Partners