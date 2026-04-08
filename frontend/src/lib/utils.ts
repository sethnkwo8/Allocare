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