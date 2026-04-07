// Main Allocation settings
"use client"

import { Card } from "../ui/card"
import { Label } from "../ui/label"
import { Slider } from "../ui/slider"

// Defining the shape of the data needed
interface MainAllocationSettingsProps {
    data: {
        needs: number;
        wants: number;
        savings: number;
    };
    onChange: (key: "needs" | "wants" | "savings", value: number) => void;
}

export function MainAllocationSettings({ data, onChange }: MainAllocationSettingsProps) {
    // Calculate total on the fly for the error message
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
                {(["needs", "wants", "savings"] as const).map((key) => (
                    <div key={key} className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="capitalize font-medium">{key}</Label>
                            <span className="text-sm font-bold text-[#2E6B6B]">{data[key]}%</span>
                        </div>
                        <Slider
                            value={[data[key]]}
                            onValueChange={(value) => onChange(key, value[0])}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                    </div>
                ))}
            </div>
        </Card>
    )
}