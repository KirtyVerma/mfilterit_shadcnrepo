
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

 export const getXAxisAngle = (data: string[]): number => {
  if (data.length === 0) {
    return 0; // or handle this case however you prefer
  }
  return data.length > 10 ? -28 : 0;
};
export const formatNumber = (value: number): string => {
  if (value >= 1e9) {
    return (value / 1e9).toFixed(1) + 'B';
  }
  if (value >= 1e6) {
    return (value / 1e6).toFixed(1) + 'M';
  }
  if (value >= 1e3) {
    return (value / 1e3) + 'K';
  }
  return value.toString();
};

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
  }
};

export const handleExportData = (
  headers: string[],
  rows: string[][],
  fileName: string
) => {
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
 export const formatValue = (value: number, labelType: string) => {
  if (labelType === "Percentage") {
    return `${Math.round(value * 100 / 1000) * 10}%`; 
  }
  return value.toLocaleString(); 
};

