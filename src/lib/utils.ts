<<<<<<< HEAD

=======
>>>>>>> d1452b7 (Initial commit)
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Dispatch, SetStateAction } from 'react';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const session = {
  set: (k: string, d: object) => {
    const b = Buffer.from(JSON.stringify(d));
    sessionStorage.setItem(k, b.toString("base64"));
  },
  get: (k: string) => {
    const b = sessionStorage.getItem(k);
    if (!b) return {};
    return JSON.parse(Buffer.from(b ?? "", "base64").toString() ?? "{}");
  },
};

export function downloadURI(uri: string, name: string) {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

<<<<<<< HEAD
 export const getXAxisAngle = (data: string[]): number => {
=======
export const getXAxisAngle = (data: string[]): number => {
>>>>>>> d1452b7 (Initial commit)
  if (data.length === 0) {
    return 0; // or handle this case however you prefer
  }
  return data.length > 10 ? -28 : 0;
};
<<<<<<< HEAD
=======

>>>>>>> d1452b7 (Initial commit)
export const formatNumber = (value: number): string => {
  if (value >= 1e9) {
    return (value / 1e9).toFixed(1) + 'B';
  }
  if (value >= 1e6) {
    return (value / 1e6).toFixed(1) + 'M';
  }
  if (value >= 1e3) {
<<<<<<< HEAD
    return (value / 1e3) + 'K';
=======
    return (value / 1e3).toFixed(1) + 'K';
>>>>>>> d1452b7 (Initial commit)
  }
  return value.toString();
};

<<<<<<< HEAD
export const onExpand = (
  index: number,
  cardRefs: React.MutableRefObject<HTMLElement[]>,
  expandedCard: number | null,
  setExpandedCard: Dispatch<SetStateAction<number | null>>
) => {
  const card = cardRefs.current[index];
  
  if (card) {
    if (!document.fullscreenElement) {
      card.requestFullscreen().catch((err) => {
        console.error('Error attempting to enable fullscreen mode:', err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error('Error attempting to exit fullscreen mode:', err);
      });
    }

    setExpandedCard(expandedCard === index ? null : index);
=======

export const onExpand = (
  key: string,
  cardRefs: React.MutableRefObject<Record<string, HTMLElement | null>>,
  expandedCard: string | null,
  setExpandedCard: Dispatch<SetStateAction<string | null>>
) => {
  const card = cardRefs.current[key];

  if (card) {
    if (!document.fullscreenElement) {
      card.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen mode:", err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Error attempting to exit fullscreen mode:", err);
      });
    }

    setExpandedCard(expandedCard === key ? null : key);
>>>>>>> d1452b7 (Initial commit)
  }
};

export const handleExportData = (
  headers: string[],
<<<<<<< HEAD
  rows: string[][],
  fileName: string
) => {
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(','))
=======
  rows: (string | number)[][],
  fileName: string
) => {
  const escapeCSV = (value: string | number) =>
    `"${String(value).replace(/"/g, '""')}"`;

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map((row) => row.map(escapeCSV).join(','))
>>>>>>> d1452b7 (Initial commit)
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
<<<<<<< HEAD
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
=======
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName.endsWith('.csv') ? fileName : `${fileName}.csv`);
>>>>>>> d1452b7 (Initial commit)
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
<<<<<<< HEAD
 export const formatValue = (value: number, labelType: string) => {
=======

export const formatValue = (value: number, labelType: string) => {
>>>>>>> d1452b7 (Initial commit)
  if (labelType === "Percentage") {
    return `${Math.round(value * 100 / 1000) * 10}%`; 
  }
  return value.toLocaleString(); 
};

<<<<<<< HEAD
=======
 export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

export const parsePercentage = (percentage: string | number): number => {
  // Check if it's a string and has the percentage sign
  if (typeof percentage === 'string') {
    return parseFloat(percentage.replace('%', '').trim());
  }
  // If it's already a number, return it as is
  if (typeof percentage === 'number') {
    return percentage;
  }
  // If it's not a valid type, return NaN or handle as needed
  return NaN;
};




>>>>>>> d1452b7 (Initial commit)
