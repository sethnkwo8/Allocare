// All goals overview cards
import { Card } from "../ui/card"
import { Target, TrendingUp } from "lucide-react"
import { GoalsOverviewCardProps } from "@/types/goals"
import { getCurrencySymbol } from "@/lib/dashboard/utils";

export function OverviewCards({ currencyCode, goals }: GoalsOverviewCardProps) {
    // Get currency symbol
    const currencySymbol = getCurrencySymbol(currencyCode)
    // Calculate totals
    const totalTargetAmount = goals.reduce((sum, goal) => sum + (Number(goal.target_amount) || 0), 0);
    const totalCurrentAmount = goals.reduce((sum, goal) => sum + (Number(goal.current_amount) || 0), 0);
    const totalRemaining = goals.reduce((sum, goal) => sum + (Number(goal.remaining_amount) || 0), 0);
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 bg-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Total Goals</p>
                        <h3 className="text-2xl mt-1">{goals.length}</h3>
                    </div>
                    <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                        <Target className="h-6 w-6 text-blue-600" />
                    </div>
                </div>
            </Card>

            <Card className="p-6 bg-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Target Amount</p>
                        <h3 className="text-2xl mt-1">{currencySymbol}{totalTargetAmount.toLocaleString()}</h3>
                    </div>
                    <div className="h-12 w-12 bg-purple-50 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                </div>
            </Card>

            <Card className="p-6 bg-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Saved Amount</p>
                        <h3 className="text-2xl mt-1">{currencySymbol}{totalCurrentAmount.toLocaleString()}</h3>
                    </div>
                    <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                </div>
            </Card>

            <Card className="p-6 bg-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Remaining</p>
                        <h3 className="text-2xl mt-1">{currencySymbol}{totalRemaining.toLocaleString()}</h3>
                    </div>
                    <div className="h-12 w-12 bg-orange-50 rounded-full flex items-center justify-center">
                        <Target className="h-6 w-6 text-orange-600" />
                    </div>
                </div>
            </Card>
        </div>
    )
}