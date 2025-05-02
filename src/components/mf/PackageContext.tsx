'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

interface PackageContextType {
  selectedPackage: string;
  setSelectedPackage: (pkg: string) => void;
}

const PackageContext = createContext<PackageContextType | undefined>(undefined);

export function PackageProvider({ children }: { children: React.ReactNode }) {
  const [selectedPackage, setSelectedPackage] = useState<string>("");

  useEffect(() => {
    // Load saved package on mount
    const savedPackage = localStorage.getItem('selectedPackage');
    if (savedPackage) {
      setSelectedPackage(savedPackage);
    }
  }, []);

  const updateSelectedPackage = (pkg: string) => {
    setSelectedPackage(pkg);
    localStorage.setItem('selectedPackage', pkg);
  };

  return (
    <PackageContext.Provider value={{ selectedPackage, setSelectedPackage: updateSelectedPackage }}>
      {children}
    </PackageContext.Provider>
  );
}

export function usePackage() {
  const context = useContext(PackageContext);
  if (context === undefined) {
    throw new Error('usePackage must be used within a PackageProvider');
  }
  return context;
} 