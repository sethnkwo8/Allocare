// Recent Expenses Section
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { Plus, ArrowUpRight, ChevronRight } from "lucide-react"
import { RecentExpensesProps } from "@/types/dashboard"
import { getCurrencySymbol } from "@/lib/dashboard/utils"
import Link from "next/link"

export function RecentExpenses({ data, setIsExpenseDialogOpen }: RecentExpensesProps) {
    // Get currency code
    const { currency_code } = data.financial_overview
    // Get currency symbol
    const currencySymbol = getCurrencySymbol(currency_code)
    // Get data
    const { recent_expenses, category_spendings } = data

    // Get category name
    function getCategory(category_id: string) {
        return category_spendings.find((c) => c.category_id === category_id)?.category_name
    }

    return (
        <Card className="p-6 bg-white shadow-sm border-none">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg text-[#2E6B6B]">Recent Expenses</h3>
                    {recent_expenses.length > 0 && (
                        <Link
                            href="/expenses"
                            className="text-xs font-medium text-muted-foreground hover:text-[#2E6B6B] flex items-center gap-0.5 transition-colors"
                        >
                            See all <ChevronRight className="h-3 w-3" />
                        </Link>
                    )}
                </div>
                <Button
                    className="bg-[#2E6B6B] hover:bg-[#2E6B6B]/90 text-white"
                    size="sm"
                    onClick={() => setIsExpenseDialogOpen(true)}
                >
                    <Plus className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Add Expense</span>
                </Button>
            </div>

            <div className="divide-y divide-gray-50">
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
                            <div key={expense.id} className="flex items-start md:items-center justify-between py-4 group">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-[#f8fcfc] flex items-center justify-center border border-[#d4f1f1] shrink-0">
                                        <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4 text-[#2E6B6B]" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-medium text-gray-900 truncate pr-2">
                                            {expense.title}
                                        </div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                                            <span className="capitalize">{categoryName || 'General'}</span>
                                            <span>•</span>
                                            <span>{new Date(expense.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="mt-1 md:hidden font-bold text-red-500 text-sm">
                                            -{currencySymbol}{Number(expense.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden md:block text-right shrink-0">
                                    <div className="font-bold text-red-500">
                                        -{currencySymbol}{Number(expense.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
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