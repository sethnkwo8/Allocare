// All goals header
"use client"

import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import { GoalForm } from "@/types/dashboard"

export function Header({
    setIsGoalDialogOpen,
    setEditId,
    setGoalForm
}: {
    setIsGoalDialogOpen(value: boolean): void
    setEditId(value: string | null): void
    setGoalForm(value: GoalForm): void
}) {
    const router = useRouter()
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.push("/dashboard")}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="font-semibold text-3xl text-[#2E6B6B]">Financial Goals</h1>
                    <p className="text-muted-foreground">Track and manage your savings goals</p>
                </div>
            </div>
            <Button onClick={() => {
                // Not in edit mode
                setEditId(null);
                // Clear form
                setGoalForm({ name: "", target_amount: "", target_date: "", description: "" })
                // Open dialog
                setIsGoalDialogOpen(true)
            }} className="bg-[#2E6B6B] hover:bg-[#2E6B6B]/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
            </Button>
        </div>
    )
}