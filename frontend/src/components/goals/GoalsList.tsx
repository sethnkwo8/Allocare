// Goals list section

import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Calendar } from "lucide-react";
import { SavingsGoal } from "@/types/dashboard";
import { formatWithCommas, getCurrencySymbol } from "@/lib/dashboard/utils";

export function GoalsList({
    currencyCode,
    goals
}: {
    currencyCode: string,
    goals: SavingsGoal[]
}) {
    // Get currency symbol
    const currencySymbol = getCurrencySymbol(currencyCode)

    // Get color for status
    const getStatusColor = (goal: SavingsGoal) => {
        const isCompleted = Number(goal.current_amount) >= Number(goal.target_amount);
        const isOverdue = new Date(goal.target_date) < new Date() && !isCompleted;

        if (isCompleted) return "bg-green-500";
        if (isOverdue) return "bg-red-500";
        return "bg-blue-500"; // In Progress
    };

    // Get text for status
    const getStatusText = (goal: SavingsGoal) => {
        const isCompleted = Number(goal.current_amount) >= Number(goal.target_amount);
        const isOverdue = new Date(goal.target_date) < new Date() && !isCompleted;

        if (isCompleted) return "Completed";
        if (isOverdue) return "Overdue";
        return "In Progress";
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => {
                const progress = goal.progress_percentage
                const remaining = goal.remaining_amount

                return (
                    <Card key={goal.id} className="p-6 bg-white">
                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="mb-1 font-semibold">{goal.name}</h3>
                                    <p className="text-sm text-muted-foreground">Financial Goals</p>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className={`${getStatusColor(goal)} text-white border-none`}
                                >
                                    {getStatusText(goal)}
                                </Badge>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-medium">{progress.toFixed(0)}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Current</p>
                                    <p className="font-medium">
                                        {currencySymbol}{formatWithCommas(Number(goal.current_amount))}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Target</p>
                                    <p className="font-medium">
                                        {currencySymbol}{formatWithCommas(Number(goal.target_amount))}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        {new Date(goal.target_date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span className="text-muted-foreground">Remaining: </span>
                                    <span className="font-medium">
                                        {currencySymbol}{formatWithCommas(remaining)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    )
}
