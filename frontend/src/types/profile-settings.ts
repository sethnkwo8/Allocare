// Interface for header props
export interface ProfileSettingsHeaderProps {
    onSave(): void;
    hasChanges: boolean;
    isSaving: boolean;
    handleBackNavigation(): void
}

// Interface for main allocation settings props
export interface MainAllocationSettingsProps {
    data: {
        needs: number;
        wants: number;
        savings: number;
    };
    onChange: (key: "needs" | "wants" | "savings", value: number) => void;
}

// Interface for category settings props
export interface CategorySettingsProps {
    breakdowns: {
        needs: Record<string, number>;
        wants: Record<string, number>;
        savings: Record<string, number>;
    };
    onChange: (bucket: "needs" | "wants" | "savings", key: string, value: number) => void;
}

// Interface for category config
export interface CategoryConfig {
    name: string;
    percentage_allocation: number;
    monthly_limit: string | number; // Handles the string in your JSON
}

// Interface for bucket config
export interface BucketConfig {
    name: string;
    percentage_allocation: number;
    categories: CategoryConfig[];
}

// Interface for Budget settings data
export interface BudgetSettingsData {
    currency: string;
    income: string | number;
    frequency: string;
    buckets: BucketConfig[];
}