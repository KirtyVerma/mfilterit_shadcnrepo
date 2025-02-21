import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Sheet } from "@/components/ui/sheet";
import { ThemeProvider } from "@/components/mf/theme-context"; // Import the ThemeProvider
import { ReactQueryProvider } from "@/context";

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

export const metadata: Metadata = {
  title: "Unified Ad Manager",
  description: "Unified Ad Manager",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
