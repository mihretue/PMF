"use client";

import React from 'react';

import HelpCenter from "@/components/help-center"

import CssBaseline from "@mui/material/CssBaseline"
import HelpCenterDetail from '@/components/help-center-detail';
export default function page() {
    return (
        <div>
            
               <CssBaseline />
               <HelpCenter />
               <HelpCenterDetail/>
        </div>
    )
}