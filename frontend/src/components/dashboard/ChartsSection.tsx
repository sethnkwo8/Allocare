// Dashboard Charts Section
import { DashboardResponse } from "@/types/dashboard";
import { Card } from "../ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { categoryColors } from "@/lib/dashboard/categoryColors";
import { getCurrencySymbol } from "@/lib/dashboard/utils";


export function ChartsSection({ data }: { data: DashboardResponse }) {

    const { budget_percentage_allocation, bucket_spendings } = data

    // Currency symbol
    const currencySymbol = getCurrencySymbol(data.financial_overview.currency_code);

    // Budget buckets percentage allocations
    const needsData = budget_percentage_allocation.find((b) => b.budget_name.toLowerCase() === "needs");
    const wantsData = budget_percentage_allocation.find((b) => b.budget_name.toLowerCase() === "wants");
    const savingsData = budget_percentage_allocation.find((b) => b.budget_name.toLowerCase() === "savings");

    // Pie chart data
    const pieData = [
        { name: "Needs", value: needsData?.percentage_allocation, color: categoryColors.needs },
        { name: "Wants", value: wantsData?.percentage_allocation, color: categoryColors.wants },
        { name: "Savings", value: savingsData?.percentage_allocation, color: categoryColors.savings },
    ]

    // Bucket data
    const needsBucketData = bucket_spendings.find((b) => b.bucket_name.toLowerCase() === "needs")
    const wantsBucketData = bucket_spendings.find((b) => b.bucket_name.toLowerCase() === "wants")
    const savingsBucketData = bucket_spendings.find((b) => b.bucket_name.toLowerCase() === "savings")

    // Bar Chart Data
    const barData = [
        { category: "Needs", budget: needsBucketData?.budget_limit, spent: needsBucketData?.total_spent },
        { category: "Wants", budget: wantsBucketData?.budget_limit, spent: wantsBucketData?.total_spent },
        { category: "Savings", budget: savingsBucketData?.budget_limit, spent: savingsBucketData?.total_spent },
    ];

    // Fallback
    if (pieData.every(item => !item.value)) {
        return <Card className="p-6 h-100 flex items-center justify-center">No allocation data available</Card>
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie chart */}
            <Card className="p-6 bg-white">
                <h3 className="mb-4">Budget Allocation</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => {
                            const numValue = Number(value ?? 0);
                            return [`${numValue}%`, 'Allocation'] as [string, string];
                        }}
                            contentStyle={{
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors.needs }}></div>
                        <span className="text-sm">Needs {needsData?.percentage_allocation}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors.wants }}></div>
                        <span className="text-sm">Wants {wantsData?.percentage_allocation}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors.savings }}></div>
                        <span className="text-sm">Savings {savingsData?.percentage_allocation}%</span>
                    </div>
                </div>
            </Card>

            {/* Bar Chart */}
            <Card className="p-6 bg-white">
                <h3 className="mb-4">Budget vs Spending</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData}>
                        <XAxis dataKey="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${currencySymbol}${value}`}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }} // Removes the gray hover box
                            formatter={(value: any) => [`${currencySymbol}${Number(value).toFixed(2)}`, '']}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend verticalAlign="top" align="right" iconType="circle" />
                        <Bar dataKey="budget" fill="#d4f1f1" name="Budget" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="spent" fill="#2E6B6B" name="Spent" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    )
}