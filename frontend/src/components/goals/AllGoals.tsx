// All goals client component
"use client"

import { Header } from "./Header"
import { useDashboard } from "@/hooks/useDashboard"
import { OverviewCards } from "./OverviewCards"
import { GoalsList } from "./GoalsList"
import { AddGoalDialog } from "../dashboard/AddGoalDialog"
import { useState } from "react"
import { GoalForm } from "@/types/dashboard"

export function AllGoals() {
    // Get dashboard data
    const { data, isLoading, errorData, refresh } = useDashboard()

    // Get user goals
    const goals = data?.goal_savings || []

    // Goal Dialog state
    const [isGoalDialogOpen, setIsGoalDialogOpen] = useState<boolean>(false)

    // Goal Form state
    const [goalForm, setGoalForm] = useState<GoalForm>({
        name: "",
        target_amount: "",
        target_date: "",
        description: "",
    })

    // Get user currency code
    const currencyCode = data?.financial_overview.currency_code || "NGN"

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
                <Header setIsGoalDialogOpen={setIsGoalDialogOpen} />
                {/* Overview Cards */}
                <OverviewCards currencyCode={currencyCode} goals={goals} />
                {/* Goals List */}
                <GoalsList currencyCode={currencyCode} goals={goals} />
            </div>

            {data && <AddGoalDialog
                data={data}
                isGoalDialogOpen={isGoalDialogOpen}
                setIsGoalDialogOpen={setIsGoalDialogOpen}
                goalForm={goalForm}
                setGoalForm={setGoalForm}
                onRefresh={refresh}
            />}

        </div>
    )
}