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
import { AddGoalDialog } from "./AddGoalDialog"
import { AllocationBanner } from "./AllocationBanner"

export function Dashboard() {
    // Get data from custom hook
    const { data, isLoading, errorData, refresh } = useDashboard()

    // Expense Dialog state
    const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState<boolean>(false)

    // Goal Dialog state
    const [isGoalDialogOpen, setIsGoalDialogOpen] = useState<boolean>(false)

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
    if (errorData) return <div>Error: {errorData}</div>
    if (!data) return null

    return (
        <div className="min-h-screen bg-linear-to-br from-[#d4f1f1] to-[#e6f5f5] p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <Header data={data} onRefresh={refresh} />
                {/* Initialize Savings Banner */}
                {data.needs_savings_init && (
                    <AllocationBanner
                        data={data}
                        plannedSavings={plannedSavings}
                        onRefresh={refresh}
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
                <AddGoalDialog
                    data={data}
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
                />
            </div>
        </div>
    )
}
