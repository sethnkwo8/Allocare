// Currency settings component
"use client"

import { CurrencyStepProps } from "@/types/onboarding"
import { Card } from "../ui/card"
import { Label } from "../ui/label"
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "../ui/select"
import { currencies } from "@/lib/onboarding/currency"

export function CurrencySettings({ value, onChange }: CurrencyStepProps) {
    return (
        <Card className="p-6 bg-white">
            <div className="space-y-6">
                <div>
                    <h3 className="font-semibold text-lg mb-1 text-[#2E6B6B]">Currency Settings</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Select your preferred currency
                    </p>
                </div>

                <div className="space-y-3">
                    <Label>Currency</Label>
                    <Select value={value} onValueChange={(value) => onChange(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a currency" />
                        </SelectTrigger>
                        <SelectContent>
                            {currencies.map((currency) => (
                                <SelectItem key={currency.code} value={currency.code}>
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">{currency.symbol}</span>
                                        <span>{currency.name}</span>
                                        <span className="text-muted-foreground">({currency.code})</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </Card>
    )
}
