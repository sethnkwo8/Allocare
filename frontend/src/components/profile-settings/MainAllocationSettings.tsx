// Main Allocation settings
"use client"

import { getCurrencySymbol } from "@/lib/dashboard/utils"
import { Card } from "../ui/card"
import { Label } from "../ui/label"
import { Slider } from "../ui/slider"
import { MainAllocationSettingsProps } from "@/types/profile-settings"

export function MainAllocationSettings({ data, onChange, income, currency }: MainAllocationSettingsProps) {
    // Monthly income
    const monthlyIncome = Number(income) || 0;

    // Get currency symbol
    const currencySymbol = getCurrencySymbol(currency)

    // Calculate total for error message
    const mainTotal = data.needs + data.wants + data.savings;

    return (
        <Card className="p-6 bg-white shadow-sm border-none">
            <div className="space-y-6">
                <div>
                    <h3 className="font-semibold text-lg mb-1 text-[#2E6B6B]">Main Budget Allocation</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Adjust how you want to split your monthly income
                    </p>

                    {/* Validation Message */}
                    {mainTotal !== 100 ? (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
                            Total allocation must be 100%. Currently: <strong>{mainTotal}%</strong>
                        </div>
                    ) : (
                        <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-4 border border-green-100">
                            Allocation is balanced (100%)
                        </div>
                    )}
                </div>

                {/* Allocation Rows */}
                {(["needs", "wants", "savings"] as const).map((key) => {
                    const percentage = data[key];
                    const amount = (percentage / 100) * monthlyIncome;

                    return (
                        <div key={key} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <Label className="capitalize font-semibold text-gray-700">{key}</Label>
                                    {/* Using your custom symbol helper */}
                                    <span className="text-xs text-[#2E6B6B] font-medium">
                                        {currencySymbol}{amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-[#2E6B6B] bg-[#2E6B6B]/5 px-2.5 py-1 rounded-md">
                                    {percentage}%
                                </span>
                            </div>
                            <Slider
                                value={[percentage]}
                                onValueChange={(value) => onChange(key, value[0])}
                                max={100}
                                step={1}
                                className="w-full cursor-pointer"
                            />
                        </div>
                    );
                })}
            </div>
        </Card>
    )
}