'use client';

import { Montserrat } from "next/font/google";
import './globals.css'

import { NotificationContextProvider } from "@/context/NotificationContext";
import { Notification } from "@/components/common/Notification"; // ✅ Make sure this path is correct

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <NotificationContextProvider>
          <Notification /> {/* ✅ Must render once, globally */}
          {children}
        </NotificationContextProvider>
      </body>
    </html>
  );
}
