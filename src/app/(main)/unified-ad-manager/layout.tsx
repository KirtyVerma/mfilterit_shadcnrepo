"use client";
import React, { useState } from "react";
import { useTheme } from "@/components/mf/theme-context";
import { MFAsideMenu, MFTopBar } from "@/components/mf";

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
        <MFAsideMenu
          isExpanded={Toggle || IsHover}
          onHover={setIsHover}
          theme={currentTheme}
        />
        <div className="scrollbar container overflow-y-auto rounded-xl bg-gray-100 p-2 dark:bg-slate-700">
          {children}
        </div>
      </div>
    </div>
  );
}
