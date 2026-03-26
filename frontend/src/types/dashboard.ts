// Props for Header
export interface HeaderProps {
    data: DashboardResponse
    onRefresh(): void
}

// Expense Form interface
export interface ExpenseForm {
    amount: string
    category: string
    description: string
}

// Expense dialog props
export interface ExpenseDialogProps {
    isDialogOpen: boolean
    setIsDialogOpen(value: boolean): void
    expenseForm: ExpenseForm
    setExpenseForm(value: ExpenseForm): void
}

// Recent Expenses props
export interface RecentExpensesProps {
    data: DashboardResponse
    setIsDialogOpen(value: boolean): void
}

// Financial overview
export interface FinancialOverview {
    total_income: number
    total_spent: number
    remaining_balance: number
    currency_code: string
    name: string
}

// Budget Allocation
export interface BudgetAllocation {
    budget_name: string
    percentage_allocation: number
}

// Recent Expense
export interface RecentExpense {
    id: string
    title: string
    amount: number
    created_at: string
    category_id: string
}

// Savings Goal
export interface SavingsGoal {
    id: string
    name: string
    target_amount: number
    current_amount: number
    progress_percentage: number
    remaining_amount: number
    target_date: string
}

// Expense Calculation Response
export interface ExpenseCalculationResponse {
    category_id: string
    category_name: string
    total_spent: number
    budget_limit: number
    remaining_budget: number
}

// Bucket Calculation Respomse
export interface BucketCalculationResponse {
    bucket_id: string
    bucket_name: string
    total_spent: number
    budget_limit: number
    remaining_budget: number
    spending_percentage: number
}

// Unread Count response
export interface UnreadCount {
    unread_count: number
}

// Dashboard response interface
export interface DashboardResponse {
    financial_overview: FinancialOverview
    budget_percentage_allocation: BudgetAllocation[]
    recent_expenses: RecentExpense[]
    goal_savings: SavingsGoal[]
    category_spendings: ExpenseCalculationResponse[]
    bucket_spendings: BucketCalculationResponse[]
    unread_count: UnreadCount
}