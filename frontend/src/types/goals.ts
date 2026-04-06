import { SavingsGoal } from "./dashboard";

// Interface for all goals overview cards
export interface GoalsOverviewCardProps {
    currencyCode: string
    goals: SavingsGoal[]
}