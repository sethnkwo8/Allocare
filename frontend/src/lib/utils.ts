import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format categories label
export function formatCategories(breakdown: Record<string, number>, categoriesList: any[]) {
  return Object.entries(breakdown).map(([id, percentage]) => {
    const categoryInfo = categoriesList.find(c => c.id === id);
    return {
      name: categoryInfo?.label || id,
      percentage_allocation: percentage,
      // frontend helper
      monthly_limit: 0
    };
  });
};

// Function to format settings payload
export function formatSettingsPayload(breakdown: Record<string, number>) {
  return Object.entries(breakdown).map(([name, percentage]) => ({
    name: name,
    percentage_allocation: percentage,
    monthly_limit: 0
  }));
}

// Format label in category settings
export function formatLabel(str: string): string {
  return str
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Function to determine if it is end of month
export const isEndOfMonth = () => {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  return (lastDay - today.getDate()) <= 3; // True during the last 3 days
};