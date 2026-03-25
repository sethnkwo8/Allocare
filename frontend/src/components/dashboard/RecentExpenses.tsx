// Recent Expenses Section

import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { Plus, ArrowUpRight } from "lucide-react"
import { DashboardResponse } from "@/types/dashboard"
import { getCurrencySymbol } from "@/lib/dashboard/utils"

export function RecentExpenses({ data }: { data: DashboardResponse }) {
    // Get currency code
    const { currency_code } = data.financial_overview

    // Get currency Symbol
    const currencySymbol = getCurrencySymbol(currency_code)

    // Get recent expenses
    const { recent_expenses } = data
    return (
        <Card className="p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
                <h3>Recent Expenses</h3>
                <Button className="bg-[#2E6B6B] hover:bg-[#2E6B6B]/90 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expense
                </Button>
            </div>
            <div className="space-y-3">
                {recent_expenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between py-3 border-b last:border-0">
                        <div className="flex items-center gap-3">
                            {/* <div className={`h-10 w-10 rounded-full flex items-center justify-center ${expense.type === 'needs' ? 'bg-blue-50' : 'bg-purple-50'
                                }`}>
                                <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                            </div> */}
                            <div>
                                <div className="font-medium">{expense.title}</div>
                                <div className="text-sm text-muted-foreground">{expense.amount} • {expense.created_at}</div>
                            </div>
                        </div>
                        <div className="font-medium">
                            -{currencySymbol}{expense.amount.toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}