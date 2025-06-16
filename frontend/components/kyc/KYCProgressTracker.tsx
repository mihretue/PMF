import React from 'react';
import { Box, Typography, Stepper, Step, StepLabel } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

interface KYCProgressTrackerProps {
  steps: string[];  // Array of KYC steps
  currentStep: number;  // Current active step index (0-based)
}

const KYCProgressTracker: React.FC<KYCProgressTrackerProps> = ({ steps, currentStep }) => {
  return (
    <Box sx={{ width: '100%', paddingY: 3, px: 1 }}>
      <Stepper alternativeLabel activeStep={currentStep}>
        {steps.map((step, index) => (
          <Step key={step} completed={index < currentStep}>
            <StepLabel
              StepIconComponent={() =>
                index <= currentStep ? (
                  <CheckCircleIcon sx={{ color: "green" }} />
                ) : index === currentStep ? (
                  <RadioButtonUncheckedIcon color="primary" />
                ) : (
                  <RadioButtonUncheckedIcon color="disabled" />
                )
              }
            >
              <Typography
                color={index === currentStep ? 'primary' : 'textSecondary'}
                fontWeight={index === currentStep ? 'bold' : 'normal'}
                variant="body2"
              >
                {step}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default KYCProgressTracker;