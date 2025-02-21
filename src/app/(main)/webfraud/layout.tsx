"use client";
import React, { useState } from "react";
import { useTheme } from "@/components/mf/theme-context";
import MFWebFraudAsideMenu from "@/components/mf/MFWebFraudAsideMenu"
import { MFTopBar } from "@/components/mf";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <MFWebFraudAsideMenu
          isExpanded={Toggle || IsHover}
          onHover={setIsHover}
          theme={currentTheme}
        />
        <div className="scrollbar container overflow-y-auto rounded-xl bg-gray-100 p-2 dark:bg-background max-w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
