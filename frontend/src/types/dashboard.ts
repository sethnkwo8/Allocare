// Props for Header
export interface HeaderProps {
    data: DashboardResponse
    onRefresh(): void
}

// Expense Form interface
export interface ExpenseForm {
    title: string
    amount: string
    category: string
    description: string
}

// Expense dialog props
export interface ExpenseDialogProps {
    categories: ExpenseCalculationResponse[]
    isExpenseDialogOpen: boolean
    setIsExpenseDialogOpen(value: boolean): void
    expenseForm: ExpenseForm
    setExpenseForm(value: ExpenseForm): void
    onRefresh(): void
}

// Goal Form interface
export interface GoalForm {
    name: string
    target_amount: string
    target_date: string
    description?: string
}

// Goal dialog props
export interface GoalDialogProps {
    isGoalDialogOpen: boolean
    setIsGoalDialogOpen(value: boolean): void
    goalForm: GoalForm
    setGoalForm(value: GoalForm): void
    onRefresh(): void
}

// Recent Expenses props
export interface RecentExpensesProps {
    data: DashboardResponse
    setIsExpenseDialogOpen(value: boolean): void
}

// Goal Section props
export interface GoalSectionProps {
    data: DashboardResponse
    setIsGoalDialogOpen(value: boolean): void
    onRefresh(): void
}

// Financial overview
export interface FinancialOverview {
    total_income: number
    base_income: number;
    rollover_amount: number;
    income_frequency: string
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
    category_percentage: number
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

// Notification response
export interface Notification {
    id: string
    title: string
    type: string
    message: string
    created_at: string
    is_read: boolean
}

// Dashboard response interface
export interface DashboardResponse {
    financial_overview: FinancialOverview
    budget_percentage_allocation: BudgetAllocation[]
    recent_expenses: RecentExpense[]
    goal_savings: SavingsGoal[]
    category_spendings: ExpenseCalculationResponse[]
    bucket_spendings: BucketCalculationResponse[]
    notifications: Notification[]
    unread_count: UnreadCount
    needs_savings_init: boolean
}

// Settings dropdown props
export interface SettingsDropdownProps {
    onRefresh(): void
}

// Allocate banner props
export interface AllocationBannerProps {
    data: DashboardResponse
    plannedSavings: number
    onRefresh(): void
}

// Deposit Dialog props
export interface DepositDialogProps {
    goal: { id: string; name: string; currency_code: string };
    isOpen: boolean;
    onClose(): void;
    onRefresh(): void;
    currencySymbol: string
}

// Update income dialog props
export interface UpdateIncomeDialogProps {
    isOpen: boolean
    onClose(): void
    onRefresh(): void
    currentIncome: number
    currentFrequency: string
    currencySymbol: string
}

// Notification dialog props
export interface NotificationDialogProps {
    data: DashboardResponse
    isNotificationsOpen: boolean
    setIsNotificationsOpen(value: boolean): void
    refresh(): void
}

// Interface for settlement modal props
export interface SettlementModalProps {
    isOpen: boolean
    onClose: () => void
    balance: number
    currencyCode: string
    goals: { id: string; name: string }[]
    onConfirm: (action: "rollover" | "goal", amount: number, goalId?: string) => Promise<void>
    refresh(): void
}