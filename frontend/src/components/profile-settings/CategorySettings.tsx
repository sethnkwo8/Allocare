// Category settings breakdown
"use client"

import { Card } from "../ui/card"
import { Label } from "../ui/label"
import { Slider } from "../ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { CategorySettingsProps } from "@/types/profile-settings"
import { formatLabel } from "@/lib/utils"
import { getCurrencySymbol } from "@/lib/dashboard/utils"

export function CategorySettings({ breakdowns, onChange, income, currency, allocations }: CategorySettingsProps) {
    const currencySymbol = getCurrencySymbol(currency)
    const calculateTotal = (data: Record<string, number> = {}) =>
        Object.values(data).reduce((sum, val) => sum + val, 0);

    const sections = [
        { id: "needs", title: "Needs Breakdown", data: breakdowns.needs, color: "text-[#2E6B6B]" },
        { id: "wants", title: "Wants Breakdown", data: breakdowns.wants, color: "text-purple-600" },
        { id: "savings", title: "Savings Breakdown", data: breakdowns.savings, color: "text-green-600" },
    ] as const;

    return (
        <Card className="p-4 bg-white shadow-sm border-none">
            <div className="mb-4 px-2">
                <h3 className="font-semibold text-lg text-[#2E6B6B]">Category Breakdowns</h3>
                <p className="text-sm text-muted-foreground">Detailed allocation for each budget bucket</p>
            </div>

            <Accordion type="single" collapsible className="w-full">
                {sections.map((section) => {
                    const sectionData = section.data || {};
                    const total = calculateTotal(sectionData);
                    const isInvalid = total !== 100;

                    // Calculate the total money assigned to this specific bucket
                    const bucketPercentage = allocations[section.id as keyof typeof allocations] || 0;
                    const bucketTotalMoney = (bucketPercentage / 100) * Number(income);

                    // Don't render sections with no categories
                    if (Object.keys(sectionData).length === 0) return null;

                    return (
                        <AccordionItem key={section.id} value={section.id} className="border-b last:border-0">
                            <AccordionTrigger className="hover:no-underline py-4 px-2">
                                <div className="flex items-center justify-between w-full pr-4">
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium">{section.title}</span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {currencySymbol}{bucketTotalMoney.toLocaleString()} available
                                        </span>
                                    </div>
                                    <span className={`text-sm font-bold ${isInvalid ? "text-destructive" : section.color}`}>
                                        {total}%
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-2 pb-6 pt-2">
                                {isInvalid && (
                                    <div className="bg-amber-50 text-amber-700 p-3 rounded-lg text-xs mb-6 border border-amber-100">
                                        The total for {section.id} must equal 100%. Current: <strong>{total}%</strong>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {Object.entries(sectionData).map(([key, value]) => {
                                        // Calculate the specific currency amount for this category
                                        const categoryMoney = (value / 100) * bucketTotalMoney;

                                        return (
                                            <div key={key} className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex flex-col">
                                                        <Label className="text-[11px] font-semibold text-gray-700">
                                                            {formatLabel(key)}
                                                        </Label>
                                                        <span className="text-[10px] text-[#2E6B6B] font-medium">
                                                            {currencySymbol}{categoryMoney.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-900">{value}%</span>
                                                </div>
                                                <Slider
                                                    value={[value]}
                                                    onValueChange={(val) => onChange(section.id, key, val[0])}
                                                    max={100}
                                                    step={1}
                                                    className="w-full cursor-pointer"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </Card>
    );
}