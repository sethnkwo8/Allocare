// Goals Section
import { Button } from "../ui/button";
import { Card } from "../ui/card"
import { Progress } from "../ui/progress"
import { Target, Calendar, Plus, ChevronRight } from "lucide-react";
import { getCurrencySymbol } from "@/lib/dashboard/utils";
import { GoalSectionProps } from "@/types/dashboard";
import Link from "next/link";
import { useState } from "react";
import { GoalDepositDialog } from "./GoalDepositDialog";

export function GoalsSection({ data, setIsGoalDialogOpen, onRefresh }: GoalSectionProps) {
    // Get currency symbol
    const currencySymbol = getCurrencySymbol(data.financial_overview.currency_code)
    // Get goal savings
    const { goal_savings } = data

    const [selectedGoal, setSelectedGoal] = useState<any>(null);

    return (
        <Card className="p-6 bg-white shadow-sm border-none">
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg text-[#2E6B6B]">Financial Goals</h3>
                        {goal_savings.length > 0 && (
                            <Link
                                href="/goals"
                                className="text-xs font-medium text-muted-foreground hover:text-[#2E6B6B] flex items-center gap-0.5 transition-colors"
                            >
                                See all <ChevronRight className="h-3 w-3" />
                            </Link>
                        )}
                    </div>
                    <Button
                        className="bg-[#2E6B6B] hover:bg-[#2E6B6B]/90 text-white"
                        size="sm"
                        onClick={() => setIsGoalDialogOpen(true)}
                    >
                        <Plus className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">Add Goal</span>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {goal_savings.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-100 rounded-xl">
                            <div className="bg-gray-50 p-3 rounded-full mb-3">
                                <Target className="h-6 w-6 text-muted-foreground opacity-50" />
                            </div>
                            <p className="text-sm font-medium text-gray-900">No goals set yet</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                What are you saving for? Set your first goal to track progress.
                            </p>
                        </div>
                    ) : (
                        goal_savings.map((goal) => {
                            const progress = Number(goal.progress_percentage ?? 0)
                            const current = Number(goal.current_amount ?? 0)
                            const target = Number(goal.target_amount ?? 0)

                            return (
                                <Card key={goal.id} className="p-5 bg-[#f8fcfc] border border-[#d4f1f1] shadow-none">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-white border border-[#d4f1f1] flex items-center justify-center">
                                                <Target className="h-5 w-5 text-[#2E6B6B]" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">{goal.name}</h4>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Target: {new Date(goal.target_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-bold text-[#2E6B6B]">{progress.toFixed(0)}%</span>
                                        </div>
                                    </div>

                                    <Progress value={progress} className="h-2 mb-4 bg-white border border-[#d4f1f1]" />

                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground font-medium">
                                            {currencySymbol}{current.toLocaleString()} <span className="text-xs font-normal">saved</span>
                                        </span>
                                        <span className="font-semibold text-gray-700">
                                            {currencySymbol}{target.toLocaleString()}
                                        </span>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 border-[#2E6B6B] text-[#2E6B6B] hover:bg-[#2E6B6B] hover:text-white"
                                        onClick={() => setSelectedGoal({
                                            id: goal.id,
                                            name: goal.name,
                                            currency_code: data.financial_overview.currency_code,
                                        })}
                                    >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Deposit
                                    </Button>
                                </Card>

                            )
                        })

                    )}
                </div>
            </div>
            {/* Deposit Dialog */}
            {
                selectedGoal && (
                    <GoalDepositDialog
                        goal={selectedGoal}
                        isOpen={!!selectedGoal}
                        onClose={() => setSelectedGoal(null)}
                        onRefresh={onRefresh}
                        currencySymbol={currencySymbol}
                    />
                )
            }
        </Card>
    )
}