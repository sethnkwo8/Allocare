// All goals client component
"use client"

import { Header } from "./Header"
import { useDashboard } from "@/hooks/useDashboard"
import { OverviewCards } from "./OverviewCards"
import { GoalsList } from "./GoalsList"
import { GoalDialog } from "../dashboard/GoalDialog"
import { useState } from "react"
import { GoalForm } from "@/types/dashboard"
import { deleteGoal } from "@/lib/api/goals"
import { GoalResponse } from "@/types/goals"
import { useGoal } from "@/hooks/useGoal"
import { GoalDepositDialog } from "../dashboard/GoalDepositDialog"
import { getCurrencySymbol } from "@/lib/dashboard/utils"

export function AllGoals() {
    // Get dashboard data
    const { data: dashboardData } = useDashboard() || []

    // Get goals data
    const { data, isLoading, errorData, refresh } = useGoal()

    // Goal Dialog state
    const [isGoalDialogOpen, setIsGoalDialogOpen] = useState<boolean>(false)

    // Current selected goal for deposit
    const [selectedGoal, setSelectedGoal] = useState<any>(null);

    // Goal Form state
    const [goalForm, setGoalForm] = useState<GoalForm>({
        name: "",
        target_amount: "",
        target_date: "",
        description: "",
    })

    // Goal id
    const [editId, setEditId] = useState<string | null>(null);

    // Get user currency code
    const currencyCode = dashboardData?.financial_overview.currency_code || "NGN"

    // Get currency symbol
    const currencySymbol = getCurrencySymbol(currencyCode)

    // Function to handle expense delete
    async function onDelete(id: string) {
        if (!confirm("Are you sure you want to delete this goal? This action cannot be undone.")) {
            return;
        }

        try {
            // Delete call
            await deleteGoal(id)
            // Refresh page
            refresh()
        } catch (error: any) {
            alert(error.message)
            console.error(error)
        }
    }

    // Function to trigger edit UI
    const handleEditClick = (goal: GoalResponse) => {
        // Fill form with existing data
        setGoalForm({
            name: goal.name,
            target_amount: goal.target_amount.toString(),
            target_date: goal.target_date.split('T')[0],
            description: goal.description || ""
        });

        // Set the ID to lnow we are in edit mode not add
        setEditId(goal.id);

        // Open the dialog
        setIsGoalDialogOpen(true);
    };

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
                <Header setIsGoalDialogOpen={setIsGoalDialogOpen} setEditId={setEditId} setGoalForm={setGoalForm} />
                {/* Overview Cards */}
                <OverviewCards currencyCode={currencyCode} goals={data} />
                {/* Goals List */}
                <GoalsList currencyCode={currencyCode} goals={data} onDelete={onDelete} handleEditClick={handleEditClick} setSelectedGoal={setSelectedGoal} />
            </div>

            {data && <GoalDialog
                isGoalDialogOpen={isGoalDialogOpen}
                setIsGoalDialogOpen={setIsGoalDialogOpen}
                goalForm={goalForm}
                setGoalForm={setGoalForm}
                onRefresh={refresh}
                mode={editId ? "edit" : "add"}
                goalId={editId}
            />}

            {selectedGoal && <GoalDepositDialog
                goal={selectedGoal}
                isOpen={!!selectedGoal}
                onClose={() => setSelectedGoal(null)}
                onRefresh={refresh}
                currencySymbol={currencySymbol}
            />}

        </div>
    )
}