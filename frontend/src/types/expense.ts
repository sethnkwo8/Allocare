// Interface for Expense response
export interface ExpenseResponse {
    id: string
    title: string
    amount: number
    category_id: string
    category_name: string
    notes?: string
    date: string
}

