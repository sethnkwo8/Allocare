// Profile settings client component
"use client"

import { Header } from "./Header"
import { useState, useEffect } from "react"
import { SetCurrency } from "@/lib/api/onboarding"
import { CurrencySettings } from "./CurrencySettings"
import { MainAllocationSettings } from "./MainAllocationSettings"
import { CategorySettings } from "./CategorySettings"
import { formatSettingsPayload } from "@/lib/utils"
import { useProfileSettings } from "@/hooks/useProfileSettings"
import { UpdateBudgetSettings } from "@/lib/api/profile-settings"

export function ProfileSettings() {
    const { data, isLoading, refresh } = useProfileSettings()

    // Local state for the selected currency
    const [selectedCurrency, setSelectedCurrency] = useState<string>("")
    const [allocations, setAllocations] = useState({ needs: 50, wants: 30, savings: 20 })
    const [isSaving, setIsSaving] = useState(false)

    // State for breakdown
    const [breakdowns, setBreakdowns] = useState({
        needs: {} as Record<string, number>,
        wants: {} as Record<string, number>,
        savings: {} as Record<string, number>
    });

    // Sync local state when dashboard data arrives
    useEffect(() => {
        if (data) {
            // Set currency
            const currencyCode = data.currency?.toUpperCase() || "";
            setSelectedCurrency(currencyCode);

            // 2. Map Main Allocations
            const mainAlloc = { needs: 0, wants: 0, savings: 0 };
            const catBreakdowns = { needs: {}, wants: {}, savings: {} };

            if (data.buckets && Array.isArray(data.buckets)) {
                data.buckets.forEach(bucket => {
                    const key = bucket.name.toLowerCase() as 'needs' | 'wants' | 'savings';

                    mainAlloc[key] = bucket.percentage_allocation;

                    const categoryMap: Record<string, number> = {};
                    if (bucket.categories) {
                        bucket.categories.forEach(cat => {
                            categoryMap[cat.name] = cat.percentage_allocation;
                        });
                    }
                    catBreakdowns[key] = categoryMap;
                });
            }

            setAllocations(mainAlloc);
            setBreakdowns(catBreakdowns);
        }
    }, [data])

    // function to handle category changes
    function handleCategoryChange(bucketId: string, categoryKey: string, value: number) {
        setBreakdowns(prev => ({
            ...prev,
            [bucketId]: {
                ...prev[bucketId as keyof typeof prev],
                [categoryKey]: value
            }
        }));
    }

    // Function to handle change in main allocation
    function handleMainAllocationChange(key: string, value: number) {
        setAllocations(prev => ({ ...prev, [key]: value }))
    }

    if (!data) return null;

    // Check if the user changed the currency
    const currencyChanged = selectedCurrency !== data?.currency;

    // Check if user changed main allocation
    const allocationsChanged = data?.buckets.some(b => {
        const key = b.name.toLowerCase() as keyof typeof allocations;
        return b.percentage_allocation !== allocations[key];
    });

    // Check if user changed category breakdown allocation
    const categoriesChanged = data?.buckets.some(b => {
        const bucketKey = b.name.toLowerCase() as keyof typeof breakdowns;
        return b.categories.some(c => c.percentage_allocation !== breakdowns[bucketKey][c.name]);
    });

    const hasChanges = currencyChanged || allocationsChanged || categoriesChanged;
    const isValid = (allocations.needs + allocations.wants + allocations.savings) === 100;

    // Function for settings save
    async function handleGlobalSave() {
        // Alert if main allocation doesn't equal 100
        if (!isValid) {
            alert("Total allocation must equal 100% before saving.");
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                currency: selectedCurrency,
                income: data?.income || 0,
                frequency: data?.frequency || "monthly",
                buckets: (['needs', 'wants', 'savings'] as const).map(key => ({
                    name: key,
                    percentage_allocation: allocations[key],
                    categories: formatSettingsPayload(breakdowns[key])
                }))
            };

            // PATCH api call
            await UpdateBudgetSettings(payload);

            // Save if currency changed
            if (currencyChanged) {
                await SetCurrency(selectedCurrency);
            }

            await refresh(); // Refresh data
            alert("Settings updated successfully!");
        } catch (error: any) {
            alert(error.message || "Failed to save settings");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#d4f1f1]">
                <p className="text-[#2E6B6B] font-medium animate-pulse">Loading your profile...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-[#d4f1f1] to-[#e6f5f5] p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <Header
                    onSave={handleGlobalSave}
                    hasChanges={hasChanges && isValid}
                    isSaving={isSaving}
                />
                {/* Currency settings */}
                <CurrencySettings value={selectedCurrency} onChange={setSelectedCurrency} />
                {/* Main Allocation settings */}
                <MainAllocationSettings
                    data={allocations}
                    onChange={handleMainAllocationChange}
                />
                {/* Category breakdown settings */}
                <CategorySettings
                    breakdowns={breakdowns}
                    onChange={handleCategoryChange}
                />
            </div>
        </div>
    )
}
