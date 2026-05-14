// Edit income section
"use client"

import { Wallet } from "lucide-react"
import { Button } from "../ui/button"
import { UpdateIncomeDialog } from "../dashboard/UpdateIncomeDialog"
import { useState } from "react"
import { EditIncomeProps } from "@/types/profile-settings"
import { getCurrencySymbol } from "@/lib/dashboard/utils"

export function EditIncome({ onSave, data }: EditIncomeProps) {
    // State for income dialog
    const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState<boolean>(false)

    // Get current user currency, income and frequency
    const currentIncome = Number(data.income)
    const currentFrequency = data.frequency
    const currencySymbol = getCurrencySymbol(data.currency)

    return (
        <div className="bg-white p-5 rounded-xl border border-muted shadow-sm flex flex-col gap-4">
            <div>
                <h3 className="font-semibold text-lg text-[#2E6B6B]">Income Settings</h3>
                <p className="text-sm text-muted-foreground">View and modify your baseline earnings</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#2E6B6B]/5 rounded-xl border border-[#2E6B6B]/10">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#2E6B6B] text-white rounded-lg">
                        <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Current Income</p>
                        <p className="text-lg font-bold text-slate-800">
                            {currencySymbol}{currentIncome?.toLocaleString()}
                            <span className="text-xs font-normal text-muted-foreground lowercase"> / {currentFrequency}</span>
                        </p>
                    </div>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    className="border-[#2E6B6B] text-[#2E6B6B] hover:bg-[#2E6B6B] hover:text-white transition-colors"
                    onClick={() => setIsIncomeDialogOpen(true)}
                >
                    Update
                </Button>
            </div>

            <UpdateIncomeDialog
                isOpen={isIncomeDialogOpen}
                onClose={() => setIsIncomeDialogOpen(false)}
                onRefresh={onSave}
                currentIncome={currentIncome}
                currentFrequency={currentFrequency}
                currencySymbol={currencySymbol}
            />
        </div>
    )
}