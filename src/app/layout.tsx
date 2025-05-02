<<<<<<< HEAD
import type { Metadata, Viewport } from "next";
=======

import type { Metadata ,Viewport} from "next";
>>>>>>> d1452b7 (Initial commit)
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Sheet } from "@/components/ui/sheet";
<<<<<<< HEAD
import { ThemeProvider } from "@/components/mf/theme-context"; // Import the ThemeProvider
import { ReactQueryProvider } from "@/context";
=======
// import { ThemeProvider } from "@/components/theme-provider";
 import { ThemeProvider } from "@/components/mf/theme-context"; 
import { ReactQueryProvider } from "@/context";
import { PackageProvider } from '@/components/mf/PackageContext';
import { DateRangeProvider } from "@/components/mf/DateRangeContext";
import {LoadingProvider} from "@/components/mf/LoadingContext";
>>>>>>> d1452b7 (Initial commit)

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
<<<<<<< HEAD

export const metadata: Metadata = {
  title: "Unified Ad Manager",
  description: "Unified Ad Manager",
=======
export const metadata: Metadata = {
  title: "mFilterIt",
  description: "mFilterIt ",
>>>>>>> d1452b7 (Initial commit)
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
<<<<<<< HEAD
};

=======
}; 
>>>>>>> d1452b7 (Initial commit)
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<<<<<<< HEAD
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <ThemeProvider>
            {/* Wrap the app in the ThemeProvider */}
            <Toaster />
            <Sheet>
              {/* <div className="bg-background text-foreground dark:bg-gray-900 dark:text-white"> */}
              {children}
              {/* </div> */}
            </Sheet>
=======
    <html lang="en" className="h-[calc(100vh_-_3.5rem)]  w-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased w-full h-full`}>
        <ReactQueryProvider>
          <ThemeProvider>
            <PackageProvider>
              <DateRangeProvider>
                <LoadingProvider>
                <Toaster />
                <Sheet  >
                  {/* <div className="bg-background text-foreground dark:bg-gray-900 dark:text-white"> */}
                  {children}
                  {/* </div> */}
                </Sheet>
                </LoadingProvider>
              </DateRangeProvider>
            </PackageProvider>
>>>>>>> d1452b7 (Initial commit)
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
