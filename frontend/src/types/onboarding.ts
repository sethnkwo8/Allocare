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