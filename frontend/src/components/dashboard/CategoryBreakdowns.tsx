// Category Breakdown section
import { getCurrencySymbol, formatWithCommas } from "@/lib/dashboard/utils";
import { DashboardResponse } from "@/types/dashboard";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { needsCategories, wantsCategories, savingsCategories } from "@/lib/onboarding/default_categories";

export function CategoryBreakdown({ data }: { data: DashboardResponse }) {
    // Get category details
    const { category_spendings } = data
    // Get currency code
    const { currency_code } = data.financial_overview
    // Get currency symbol
    const currencySymbol = getCurrencySymbol(currency_code)

    // Function to get category data
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
            {buckets.map((bucket) => {
                const bucketData = data.bucket_spendings.find((b) => b.bucket_name === bucket.name);
                const bucketAmount = Number(bucketData?.budget_limit ?? 0);

                return (
                    <Card key={bucket.name} className="p-6 bg-white shadow-sm border-none">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-[#2E6B6B]">{bucket.label}</h3>
                            <span className="text-sm font-medium text-muted-foreground">
                                {currencySymbol}{formatWithCommas(bucketAmount.toFixed(0))}
                            </span>
                        </div>

                        <div className="space-y-6">
                            {bucket.categories.map((static_category) => {
                                const category = getCategoryData(static_category);
                                const Icon = static_category.icon;

                                return (
                                    <div key={static_category.id} className="space-y-2">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 text-sm">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <Icon className={`h-4 w-4 shrink-0 ${bucket.iconColor}`} />
                                                <span className="font-medium text-gray-700 truncate">
                                                    {static_category.label}
                                                </span>
                                            </div>
                                            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                                                <span className={`font-semibold ${category.total_spent > category.budget_limit
                                                    ? 'text-red-500'
                                                    : 'text-gray-900'
                                                    }`}>
                                                    {currencySymbol}{formatWithCommas(category.total_spent.toFixed(0))}
                                                </span>
                                                <span className="mx-1">/</span>
                                                {currencySymbol}{formatWithCommas(category.budget_limit.toFixed(0))}
                                            </span>
                                        </div>
                                        <Progress
                                            value={category.percentSpent}
                                            className="h-1.5"
                                            indicatorClassName={
                                                category.total_spent > category.budget_limit
                                                    ? "bg-red-500"
                                                    : bucket.name === "needs" ? "bg-blue-600" :
                                                        bucket.name === "wants" ? "bg-purple-600" : "bg-green-600"
                                            }
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}