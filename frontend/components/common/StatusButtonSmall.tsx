// StatusButton.js
import React from 'react';
import { Box,  Typography } from '@mui/material';

interface statusButtonProps {
    bgColor: string;
    text: string;
}

const StatusButtonSmall: React.FC<statusButtonProps> = ({ bgColor, text }) => {

  return (
    <Box sx={{height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'start'}}>
      <Box
      sx={{
        backgroundColor: bgColor + '20',
        borderRadius: '50px',
        whiteSpace: 'nowrap',
        width: '100px',
        height: 'fit-content',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        padding: { xs: '3px 5px', sm: '4px 6px', md: '5px 7px' },
      }}
    >
      <Typography variant="subtitle2" sx={{color: bgColor, fontWeight: "bold"}}>
        {text}
      </Typography>
    </Box>
    </Box>
  );
};

export default StatusButtonSmall;
