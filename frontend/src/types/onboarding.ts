import { LucideIcon } from "lucide-react"

// Onboarding data interface
export interface OnboardingData {
    currency: string
    income: string
    frequency: string
    mainAllocation: {
        needs: number
        wants: number
        savings: number
    }
    needsBreakdown: Record<string, number>;
    wantsBreakdown: Record<string, number>;
    savingsBreakdown: Record<string, number>;
}

// Currency steps props interface
export interface CurrencyStepProps {
    value: string;
    onChange(value: string): void;
}

// Frequency steps props interface
export interface IncomeFrequencyStepProps {
    income: string;
    frequency: string;
    onIncomeChange: (value: string) => void;
    onFrequencyChange: (value: string) => void;
    currencySymbol: string;
}

// Props for main allocation buckets
export interface MainAllocationProps {
    allocations: {
        needs: number;
        wants: number;
        savings: number
    }
    onChange(allocations: { needs: number; wants: number; savings: number }): void;
    currencySymbol: string;
    income: string;
}

// Interface for categories
export interface Category {
    id: string
    label: string
    icon: LucideIcon
    description: string
}

// Props for needs allocation breakdown
export interface CategoryBreakdownStepProps {
    title: string
    categories: Category[]
    breakdown: Record<string, number>;
    onChange(breakdown: Record<string, number>): void;
    currencySymbol: string;
    categoryAmount: number;
    colorClass?: string;
}