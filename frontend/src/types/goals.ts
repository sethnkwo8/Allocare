import { SavingsGoal } from "./dashboard";

// Interface for all goals overview cards
export interface GoalsOverviewCardProps {
    currencyCode: string
    goals: GoalResponse[]
}

// Interface for goal response
export interface GoalResponse {
    id: string
    name: string
    description: string
    target_amount: number
    current_amount: number
    progress_percentage: number
    remaining_amount: number
    target_date: string
    is_completed: boolean
}