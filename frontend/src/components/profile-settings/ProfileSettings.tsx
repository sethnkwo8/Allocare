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
import { useRouter } from "next/navigation"
import { ErrorSkeleton } from "../error/ErrorSkeleton"
import { toast } from "sonner"

export function ProfileSettings() {
    const { data, isLoading, errorData, refresh } = useProfileSettings()

    // Get monthly income and currency
    const income = data?.income || 0
    const currency = data?.currency || "NGN"

    // router constant
    const router = useRouter();

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

    // Check if the user changed the currency
    const currencyChanged = data ? selectedCurrency !== data.currency : false;

    // Check if user changed main allocation
    const allocationsChanged = data?.buckets?.some(b => {
        const key = b.name.toLowerCase() as keyof typeof allocations;
        return b.percentage_allocation !== allocations[key];
    }) ?? false;

    // Check if user changed category breakdown allocation
    const categoriesChanged = data?.buckets?.some(b => {
        const bucketKey = b.name.toLowerCase() as keyof typeof breakdowns;
        return b.categories?.some(c => c.percentage_allocation !== breakdowns[bucketKey][c.name]);
    }) ?? false;

    const hasChanges = currencyChanged || allocationsChanged || categoriesChanged;
    const isValid = (allocations.needs + allocations.wants + allocations.savings) === 100;

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

    // useEffect to handle back or refresh in browser if unsaved changes
    useEffect(() => {
        if (!hasChanges) return;

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [hasChanges]);

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

    // User wants to leave to dashboard with unsaved changes
    const handleBackNavigation = () => {
        if (hasChanges) {
            const confirmLeave = window.confirm(
                "You have unsaved changes. Are you sure you want to leave without saving?"
            );
            if (!confirmLeave) return; // Stay on the page
        }

        router.push("/dashboard"); // Proceed to dashboard
    };

    // Function for settings save
    async function handleGlobalSave() {
        // Alert if main allocation doesn't equal 100
        if (!isValid) {
            toast.error("Allocation Error", {
                description: "Total allocation must equal 100% before saving. Please adjust your bucket percentages.",
            });
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
            // Success Feedback
            toast.success("Settings Saved", {
                description: "Your budget structure and currency preferences have been updated.",
            });
        } catch (error: any) {
            toast.error("Save Failed", {
                description: error.message || "We couldn't update your settings. Please check your inputs.",
            });
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

    if (errorData) {
        return (
            <div className="min-h-screen bg-[#d4f1f1]/30 flex items-center justify-center">
                <ErrorSkeleton
                    message={errorData}
                    retry={() => refresh()}
                />
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-linear-to-br from-[#d4f1f1] to-[#e6f5f5] p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <Header
                    onSave={handleGlobalSave}
                    hasChanges={hasChanges && isValid}
                    isSaving={isSaving}
                    handleBackNavigation={handleBackNavigation}
                />
                {/* Currency settings */}
                <CurrencySettings value={selectedCurrency} onChange={setSelectedCurrency} />
                {/* Main Allocation settings */}
                <MainAllocationSettings
                    data={allocations}
                    onChange={handleMainAllocationChange}
                    income={income}
                    currency={currency}
                />
                {/* Category breakdown settings */}
                <CategorySettings
                    breakdowns={breakdowns}
                    onChange={handleCategoryChange}
                    income={income}
                    currency={currency}
                    allocations={allocations}
                />
            </div>
        </div>
    )
}
