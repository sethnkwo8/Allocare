// Recent Expenses Section

import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { Plus, ArrowUpRight } from "lucide-react"
import { DashboardResponse } from "@/types/dashboard"
import { getCurrencySymbol } from "@/lib/dashboard/utils"

export function RecentExpenses({ data }: { data: DashboardResponse }) {
    const { currency_code } = data.financial_overview
    const currencySymbol = getCurrencySymbol(currency_code)
    const { recent_expenses, category_spendings } = data

    function getCategory(category_id: string) {
        return category_spendings.find((c) => c.category_id === category_id)?.category_name
    }

    return (
        <Card className="p-6 bg-white">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg text-[#2E6B6B]">Recent Expenses</h3>
                <Button className="bg-[#2E6B6B] hover:bg-[#2E6B6B]/90 text-white size-sm md:size-default">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden md:inline">Add Expense</span>
                    <span className="inline md:hidden">Add</span>
                </Button>
            </div>

            <div className="space-y-1">
                {recent_expenses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-100 rounded-xl">
                        <div className="bg-gray-50 p-3 rounded-full mb-3">
                            <Plus className="h-6 w-6 text-muted-foreground opacity-50" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">No expenses yet</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Start tracking your spending to see it here.
                        </p>
                    </div>
                ) : (
                    recent_expenses.map((expense) => {
                        const categoryName = getCategory(expense.category_id);
                        return (
                            <div key={expense.id} className="flex items-center justify-between py-3 group">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-[#f8fcfc] flex items-center justify-center border border-[#d4f1f1]">
                                        <ArrowUpRight className="h-4 w-4 text-[#2E6B6B]" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{expense.title}</div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                                            <span className="capitalize">{categoryName || 'General'}</span>
                                            <span>•</span>
                                            <span>{new Date(expense.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold text-red-500">
                                        -{currencySymbol}{Number(expense.amount).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </Card>
    )
}