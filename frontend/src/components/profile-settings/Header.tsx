// Profile settings heading
"use client"

import { ProfileSettingsHeaderProps } from "@/types/profile-settings"
import { Button } from "../ui/button"
import { ArrowLeft, Save, Loader2, Wallet } from "lucide-react"
import { useState } from "react"
import { UpdateIncomeDialog } from "../dashboard/UpdateIncomeDialog"
import { getCurrencySymbol } from "@/lib/dashboard/utils"

export function Header({ onSave, hasChanges, isSaving, handleBackNavigation, data, onRefresh }: ProfileSettingsHeaderProps) {

    // State for income dialog
    const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState<boolean>(false)

    // Get current user currency, income and frequency
    const currentIncome = Number(data.income)
    const currentFrequency = data.frequency
    const currencySymbol = getCurrencySymbol(data.currency)
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleBackNavigation}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="font-semibold text-3xl text-[#2E6B6B]">Profile Settings</h1>
                    <p className="text-sm text-muted-foreground">Update your budget allocations</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    className="hover:text-[#2E6B6B] hover:border-[#2E6B6B]"
                // onClick={}
                >
                    <Wallet className="h-4 w-4 mr-2" />
                    Edit Income
                </Button>

                <Button
                    className="bg-[#2E6B6B] hover:bg-[#2E6B6B]/90 text-white"
                    onClick={onSave}
                    disabled={!hasChanges || isSaving}
                >
                    {isSaving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4 mr-2" />
                    )}
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            {/* Income dialog */}
            <UpdateIncomeDialog
                isOpen={isIncomeDialogOpen}
                onClose={() => setIsIncomeDialogOpen(false)}
                onRefresh={onRefresh}
                currentIncome={currentIncome}
                currentFrequency={currentFrequency}
                currencySymbol={currencySymbol}
            />
        </div>
    )
}
