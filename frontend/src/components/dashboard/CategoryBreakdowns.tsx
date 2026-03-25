// Category Breakdown section
import { getCurrencySymbol, formatWithCommas } from "@/lib/dashboard/utils";
import { DashboardResponse } from "@/types/dashboard";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { needsCategories, wantsCategories, savingsCategories } from "@/lib/onboarding/default_categories";

export function CategoryBreakdown({ data }: { data: DashboardResponse }) {
    // Get category details
    const { category_spendings } = data

    // Function to get merge category data with api data
    function getCategoryData(static_category: any) {
        const apiData = category_spendings.find((c) => c.category_name.toLowerCase() == static_category.label.toLowerCase())
        const total_spent = Number(apiData?.total_spent ?? 0);
        const budget_limit = Number(apiData?.budget_limit ?? 0);

        return {
            ...static_category,
            total_spent,
            budget_limit,
            percentSpent: budget_limit > 0 ? (total_spent / budget_limit) * 100 : 0
        };
    }

    // Get currency code
    const { currency_code } = data.financial_overview

    // Get currency symbol
    const currencySymbol = getCurrencySymbol(currency_code)

    // Get needs details
    const needs_data = data.bucket_spendings.find((b) => b.bucket_name === "needs")
    const needsAmount = Number(needs_data?.budget_limit ?? 0)

    // Get wants details
    const wants_data = data.bucket_spendings.find((b) => b.bucket_name === "wants")
    const wantsAmount = Number(wants_data?.budget_limit ?? 0)

    // Get needs details
    const savings_data = data.bucket_spendings.find((b) => b.bucket_name === "savings")
    const savingsAmount = Number(savings_data?.budget_limit ?? 0)



    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Needs */}
            <Card className="p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                    <h3>Needs</h3>
                    <span className="text-sm text-muted-foreground">{currencySymbol}{formatWithCommas(needsAmount.toFixed(2))}</span>
                </div>
                <div className="space-y-4">
                    {needsCategories.map((static_category) => {
                        const category = getCategoryData(static_category)
                        const Icon = static_category.icon;

                        return (
                            <div key={static_category.id} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <Icon className="h-4 w-4 text-blue-600" />
                                        <span>{static_category.label}</span>
                                    </div>
                                    <span className="text-muted-foreground">
                                        {currencySymbol}{category.total_spent.toFixed(0)} / {currencySymbol}{formatWithCommas(category.budget_limit.toFixed(0))}
                                    </span>
                                </div>
                                <Progress value={category.percentSpent} className="h-2" />
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Wants */}
            <Card className="p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                    <h3>Wants</h3>
                    <span className="text-sm text-muted-foreground">{currencySymbol}{formatWithCommas(wantsAmount.toFixed(2))}</span>
                </div>
                <div className="space-y-4">
                    {wantsCategories.map((static_category) => {
                        const category = getCategoryData(static_category)
                        const Icon = static_category.icon;

                        return (
                            <div key={static_category.id} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <Icon className="h-4 w-4 text-purple-600" />
                                        <span>{static_category.label}</span>
                                    </div>
                                    <span className="text-muted-foreground">
                                        {currencySymbol}{category.total_spent.toFixed(0)} / {currencySymbol}{formatWithCommas(category.budget_limit.toFixed(0))}
                                    </span>
                                </div>
                                <Progress value={category.percentSpent} className="h-2" />
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Savings */}
            <Card className="p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                    <h3>Savings</h3>
                    <span className="text-sm text-muted-foreground">{currencySymbol}{formatWithCommas(savingsAmount.toFixed(2))}</span>
                </div>
                <div className="space-y-4">
                    {savingsCategories.map((static_category) => {
                        const category = getCategoryData(static_category)
                        const Icon = category.icon;
                        return (
                            <div key={static_category.id} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <Icon className="h-4 w-4 text-green-600" />
                                        <span>{static_category.label}</span>
                                    </div>
                                    <span className="text-muted-foreground">
                                        {currencySymbol}{category.total_spent.toFixed(0)} / {currencySymbol}{formatWithCommas(category.budget_limit.toFixed(0))}
                                    </span>
                                </div>
                                <Progress value={category.percentSpent} className="h-2" />
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    )
}