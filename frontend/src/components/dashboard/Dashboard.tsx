// Dashboard
"use client"

import { useDashboard } from "@/hooks/useDashboard"
import { OverviewCards } from "./OverviewCards"
import { Header } from "./Header"
import { ChartsSection } from "./ChartsSection"
import { CategoryBreakdown } from "./CategoryBreakdowns"
import { RecentExpenses } from "./RecentExpenses"
import { GoalsSection } from "./GoalsSection"
import { useState } from "react"
import { ExpenseDialog } from "./ExpenseDialog"
import { ExpenseForm, GoalForm } from "@/types/dashboard"
import { GoalDialog } from "./GoalDialog"
import { AllocationBanner } from "./AllocationBanner"
import { ErrorSkeleton } from "../error/ErrorSkeleton"
import { SettlementBanner } from "./SettlementBanner"
import { SettlementModal } from "./SettlementModal"
import { isEndOfMonth } from "@/lib/utils"
import { getCurrencySymbol } from "@/lib/dashboard/utils"
import { handleSettlementConfirm } from "@/lib/api/dashboard"
import { useAiInsight } from "@/hooks/useAiInsight"
import { AIInsightsCard } from "./AIInsightsCard"

export function Dashboard() {
    // Get data from custom hook
    const { data, isLoading, errorData, refresh } = useDashboard()

    const { insight, isLoading: insightIsLoading } = useAiInsight()

    // Expense Dialog state
    const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState<boolean>(false)

    // Goal Dialog state
    const [isGoalDialogOpen, setIsGoalDialogOpen] = useState<boolean>(false)

    // Settlement State
    const [isSettlementOpen, setIsSettlementOpen] = useState(false);

    // State for if settlement banner is dismissed
    const [bannerDismissed, setBannerDismissed] = useState(false);

    // Get remaining balance
    const remaining = data?.financial_overview.remaining_balance ?? 0;

    // Logic for showing settlement
    const showSettlementUI = isEndOfMonth() && remaining > 0;

    // Inside your Dashboard component
    const savingsBucket = data?.bucket_spendings.find(b => b.bucket_name.toLowerCase() === "savings");
    const plannedSavings = savingsBucket ? savingsBucket.budget_limit : 0;

    // Expense Form state
    const [expenseForm, setExpenseForm] = useState<ExpenseForm>({
        title: "",
        amount: "",
        category: "",
        description: "",
    });

    // Goal Form state
    const [goalForm, setGoalForm] = useState<GoalForm>({
        name: "",
        target_amount: "",
        target_date: "",
        description: "",
    })

    // Loading skeleton
    if (isLoading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <h1 className="text-2xl font-bold text-[#2E6B6B] animate-pulse mb-4">
                Allocare
            </h1>
            <div className="w-8 h-8 border-4 border-[#2E6B6B] border-t-transparent rounded-full animate-spin"></div>
        </div>
    )
    if (errorData) {
        return (
            <div className="min-h-screen bg-[#d4f1f1]/30 flex items-center justify-center">
                <ErrorSkeleton
                    message={errorData}
                    retry={() => refresh()}
                />
            </div>
        );
    }
    if (!data) return null

    return (
        <div className="min-h-screen bg-linear-to-br from-[#d4f1f1] to-[#e6f5f5] p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <Header data={data} onRefresh={refresh} />
                {/* AI Insights Card */}
                <AIInsightsCard insight={insight} isLoading={insightIsLoading} />
                {/* Initialize Savings Banner */}
                {data.needs_savings_init && (
                    <AllocationBanner
                        data={data}
                        plannedSavings={plannedSavings}
                        onRefresh={refresh}
                    />
                )}
                {/* Settlement Banner */}
                {showSettlementUI && !bannerDismissed && (
                    <SettlementBanner
                        balance={remaining}
                        currencySymbol={getCurrencySymbol(data?.financial_overview.currency_code)}
                        onSettle={() => setIsSettlementOpen(true)}
                    />
                )}
                {/* Overview Cards */}
                <OverviewCards data={data} />
                {/* Charts Section */}
                <ChartsSection data={data} />
                {/* Category Breakdowns */}
                <CategoryBreakdown data={data} />
                {/* Goals Section */}
                <GoalsSection data={data} setIsGoalDialogOpen={setIsGoalDialogOpen} onRefresh={refresh} />
                {/* Recent Expenses */}
                <RecentExpenses data={data} setIsExpenseDialogOpen={setIsExpenseDialogOpen} />
                {/* Add Goal Dialog */}
                <GoalDialog
                    isGoalDialogOpen={isGoalDialogOpen}
                    setIsGoalDialogOpen={setIsGoalDialogOpen}
                    goalForm={goalForm}
                    setGoalForm={setGoalForm}
                    onRefresh={refresh}
                />
                {/* Add Expense Dialog */}
                <ExpenseDialog
                    categories={data.category_spendings}
                    isExpenseDialogOpen={isExpenseDialogOpen}
                    setIsExpenseDialogOpen={setIsExpenseDialogOpen}
                    expenseForm={expenseForm}
                    setExpenseForm={setExpenseForm}
                    onRefresh={refresh}
                    currencyCode={data.financial_overview.currency_code}
                />
                {/* Setllement modal */}
                <SettlementModal
                    isOpen={isSettlementOpen}
                    onClose={() => {
                        setIsSettlementOpen(false);
                        setBannerDismissed(true);
                    }}
                    balance={remaining}
                    currencyCode={data.financial_overview.currency_code}
                    goals={data.goal_savings.map(g => ({ id: g.id, name: g.name }))}
                    onConfirm={handleSettlementConfirm}
                    refresh={refresh}
                />
            </div>
        </div>
    )
}
