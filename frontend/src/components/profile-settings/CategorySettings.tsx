// Category settings breakdown
"use client"

import { Card } from "../ui/card"
import { Label } from "../ui/label"
import { Slider } from "../ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { CategorySettingsProps } from "@/types/profile-settings"
import { formatLabel } from "@/lib/utils"

export function CategorySettings({ breakdowns, onChange }: CategorySettingsProps) {
    const calculateTotal = (data: Record<string, number> = {}) =>
        Object.values(data).reduce((sum, val) => sum + val, 0);

    const sections = [
        { id: "needs", title: "Needs Breakdown", data: breakdowns.needs, color: "text-blue-600" },
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

                    // Don't render sections with no categories
                    if (Object.keys(sectionData).length === 0) return null;

                    return (
                        <AccordionItem key={section.id} value={section.id} className="border-b last:border-0">
                            <AccordionTrigger className="hover:no-underline py-4 px-2">
                                <div className="flex items-center justify-between w-full pr-4">
                                    <span className="font-medium">{section.title}</span>
                                    <span className={`text-sm font-bold ${isInvalid ? "text-destructive" : section.color}`}>
                                        {total}%
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-2 pb-6 pt-2">
                                {isInvalid && (
                                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs mb-6 border border-red-100">
                                        The total for {section.id} must equal 100%. Current: <strong>{total}%</strong>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {Object.entries(sectionData).map(([key, value]) => (
                                        <div key={key} className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                {/* Use your formatLabel helper here */}
                                                <Label className="text-xs text-muted-foreground">{formatLabel(key)}</Label>
                                                <span className="text-sm font-semibold">{value}%</span>
                                            </div>
                                            <Slider
                                                value={[value]}
                                                onValueChange={(val) => onChange(section.id, key, val[0])}
                                                max={100}
                                                step={1}
                                                className="w-full"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </Card>
    );
}