"use client";
import React, { useState } from "react";
import { useTheme } from "@/components/mf/theme-context";
import MFWebFraudAsideMenu from "@/components/mf/MFWebFraudAsideMenu"
import { MFTopBar } from "@/components/mf";
<<<<<<< HEAD
=======
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { usePathname } from 'next/navigation';
>>>>>>> d1452b7 (Initial commit)

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
<<<<<<< HEAD
  const { isDarkMode, toggleTheme } = useTheme();
  const [IsHover, setIsHover] = useState(false);
  const [Toggle, setToggle] = useState(false);

  const currentTheme = isDarkMode ? "dark" : "light";

  return (
    <div className="h-screen dark:bg-black">
      <MFTopBar
        isExpanded={Toggle || IsHover}
        onToggle={() => setToggle(!Toggle)}
      />
      <div className="flex h-[calc(100vh_-_3.5rem)]">
=======
  const { isDarkMode } = useTheme();
  const [IsHover, setIsHover] = useState(false);
  const [Toggle, setToggle] = useState(false);
  const pathname = usePathname();

  const currentTheme = isDarkMode ? "dark" : "light";
  


  return (
    <div className="h-screen w-full dark:bg-black">
      <MFTopBar
        isExpanded={Toggle || IsHover}
        onToggle={() => setToggle(!Toggle)}
        isCalender={true}
      />
      <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
>>>>>>> d1452b7 (Initial commit)
        <MFWebFraudAsideMenu
          isExpanded={Toggle || IsHover}
          onHover={setIsHover}
          theme={currentTheme}
        />
<<<<<<< HEAD
        <div className="scrollbar container overflow-y-auto rounded-xl bg-gray-100 p-2 dark:bg-background max-w-full">
          {children}
        </div>
=======
        <QueryClientProvider client={queryClient}>
          <div className="flex-1 overflow-auto bg-gray-100 p-2 dark:bg-background">
            {children}
          </div>
        </QueryClientProvider>
>>>>>>> d1452b7 (Initial commit)
      </div>
    </div>
  );
}
