// Dashboard Charts Section

import { DashboardResponse } from "@/types/dashboard";
import { Card } from "../ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { categoryColors } from "@/lib/dashboard/categoryColors";


export function ChartsSection({ data }: { data: DashboardResponse }) {

    const { budget_percentage_allocation } = data
    const needsData = budget_percentage_allocation.find((b) => b.budget_name.toLowerCase() === "needs");
    const wantsData = budget_percentage_allocation.find((b) => b.budget_name.toLowerCase() === "wants");
    const savingsData = budget_percentage_allocation.find((b) => b.budget_name.toLowerCase() === "savings");

    const pieData = [
        { name: "Needs", value: needsData?.percentage_allocation, color: categoryColors.needs },
        { name: "Wants", value: wantsData?.percentage_allocation, color: categoryColors.wants },
        { name: "Savings", value: savingsData?.percentage_allocation, color: categoryColors.savings },
    ]

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
        </div>
    )
}