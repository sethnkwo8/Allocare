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
import { AddExpenseDialog } from "./AddExpenseDialog"
import { ExpenseForm } from "@/types/dashboard"

export function Dashboard() {
    // Get data from custom hook
    const { data, isLoading, errorData, refresh } = useDashboard()

    // Expense Dialog state
    const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState<boolean>(false)

    // Goal Dialog state
    const [isGoalDialogOpen, setIsGoalDialogOpen] = useState<boolean>(false)


    // Expense Form state
    const [expenseForm, setExpenseForm] = useState<ExpenseForm>({
        title: "",
        amount: "",
        category: "",
        description: "",
    });

    // Loading kkeleton
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
                {/* Overview Cards */}
                <OverviewCards data={data} />
                {/* Charts Section */}
                <ChartsSection data={data} />
                {/* Category Breakdowns */}
                <CategoryBreakdown data={data} />
                {/* Goals Section */}
                <GoalsSection data={data} />
                {/* Recent Expenses */}
                <RecentExpenses data={data} setIsDialogOpen={setIsExpenseDialogOpen} />
                {/* Add Expense Dialog */}
                <AddExpenseDialog
                    data={data}
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
