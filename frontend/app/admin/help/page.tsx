"use client";

import React from 'react';

import HelpCenter from "@/components/help/help-center"

import CssBaseline from "@mui/material/CssBaseline"
import HelpCenterDetail from '@/components/help/help-center-detail';
export default function page() {
    return (
        <div>
            
               <CssBaseline />
               <HelpCenter />
               <HelpCenterDetail/>
        </div>
    )
}