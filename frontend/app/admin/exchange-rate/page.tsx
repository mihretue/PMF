"use client";

import React from 'react';
import ExchangeRateChart from '@/components/exchange/ExchangeRateChart';
import CurrencyConverterCard from '@/components/exchange/CurrencyConverterCard';
import { Box } from '@mui/material';
import { Button } from '@/components/ui/button';
import RateAlertModal from '@/components/exchange/RateAlertModal'; // Import your modal component

export default function page() {
    const [openRateModal, setOpenRateModal] = React.useState(false); // State to manage modal visibility

    return (
        <>
            {/* Button to open the Rate Alert Modal */}
            <Button variant='outlined' onClick={() => setOpenRateModal(true)}>
                Set Rate Alert
            </Button>

            {/* Modal for Rate Alert */}
            {openRateModal && (
                <RateAlertModal open={openRateModal} onClose={() => setOpenRateModal(false)} />
            )}

            <Box 
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', lg: 'row' }, 
                    gap: 2, 
                    alignItems: 'flex-start', 
                }}
            >
                <Box sx={{ flex: 1, maxWidth: { xs: '100%', lg: '45%' } }}>
                    <CurrencyConverterCard />
                </Box>
                <Box sx={{ flex: 1, maxWidth: { xs: '100%', lg: '50%' } }}>
                    <ExchangeRateChart />
                </Box>
            </Box>
        </>
    );
}