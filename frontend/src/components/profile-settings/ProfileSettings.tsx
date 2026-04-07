// Profile settings client component
"use client"

import { Header } from "./Header"
import { useDashboard } from "@/hooks/useDashboard"
import { useState, useEffect } from "react"
import { SetCurrency } from "@/lib/api/onboarding"
import { CurrencySettings } from "./CurrencySettings"

export function ProfileSettings() {
    const { data, refresh } = useDashboard();

    // Local state for the selected currency
    const [selectedCurrency, setSelectedCurrency] = useState<string>("")
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    // Sync local state when dashboard data arrives
    useEffect(() => {
        if (data?.financial_overview?.currency_code) {
            setSelectedCurrency(data.financial_overview.currency_code)
        }
    }, [data])

    // Check if the user changed the currency
    const hasChanges = selectedCurrency !== data?.financial_overview?.currency_code;

    // Function for settings save
    async function handleGlobalSave() {
        setIsSaving(true);
        try {
            // Save if currency changed
            if (hasChanges) {
                await SetCurrency(selectedCurrency);
            }
            // Add other setting updates here (income, breakdown, etc.)

            await refresh(); // Refresh dashboard data
            alert("Settings updated successfully!");
        } catch (error: any) {
            alert(error.message || "Failed to save settings");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-[#d4f1f1] to-[#e6f5f5] p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <Header
                    onSave={handleGlobalSave}
                    hasChanges={hasChanges}
                    isSaving={isSaving}
                />
                {/* Currency settings */}
                <CurrencySettings value={selectedCurrency} onChange={(val) => setSelectedCurrency(val)} />
            </div>
        </div>
    )
}
