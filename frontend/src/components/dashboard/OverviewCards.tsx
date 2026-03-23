import { DashboardResponse } from "@/types/dashboard"
import { Card } from "../ui/card"
import { Wallet, ArrowDownRight, ArrowUpRight, PiggyBank, TrendingUp } from "lucide-react"
import { getCurrencySymbol } from "@/lib/dashboard/utils"

export function OverviewCards({ data }: { data: DashboardResponse }) {
    const { currency_code, total_income, total_spent } = data.financial_overview
    const { bucket_spendings } = data
    const currencySymbol = getCurrencySymbol(currency_code)



    const savingsData = bucket_spendings.find((b) => b.bucket_name.toLowerCase() === "savings")
    const savingsSpent = Number(savingsData?.total_spent)
    const savingsPercentage = Number(savingsData?.spending_percentage)

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 bg-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Total Income</p>
                        <h3 className="text-2xl mt-1">{currencySymbol}{total_income.toFixed(2)}</h3>
                        <p className="text-xs text-muted-foreground mt-1 capitalize">Monthly</p>
                    </div>
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Wallet className="h-6 w-6 text-primary" />
                    </div>
                </div>
            </Card>

            <Card className="p-6 bg-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Total Spent</p>
                        <h3 className="text-2xl mt-1">{currencySymbol}{total_spent.toFixed(2)}</h3>
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <ArrowDownRight className="h-3 w-3" />
                            {((total_spent / total_income) * 100).toFixed(1)}% of income
                        </p>
                    </div>
                    <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                        <ArrowUpRight className="h-6 w-6 text-blue-600" />
                    </div>
                </div>
            </Card>

            <Card className="p-6 bg-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Remaining</p>
                        <h3 className="text-2xl mt-1">{currencySymbol}{(total_income - total_spent).toFixed(2)}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            {(((total_income - total_spent) / total_income) * 100).toFixed(1)}% unallocated
                        </p>
                    </div>
                    <div className="h-12 w-12 bg-purple-50 rounded-full flex items-center justify-center">
                        <PiggyBank className="h-6 w-6 text-purple-600" />
                    </div>
                </div>
            </Card>

            <Card className="p-6 bg-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Savings Goal</p>
                        <h3 className="text-2xl mt-1">{currencySymbol}{(savingsSpent ?? 0).toFixed(2)}</h3>
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3" />
                            {savingsPercentage > 0
                                ? `${savingsPercentage.toFixed(0)}% achieved`
                                : "No contributions yet this month"}
                        </p>
                    </div>
                    <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                </div>
            </Card>
        </div>
    )
}