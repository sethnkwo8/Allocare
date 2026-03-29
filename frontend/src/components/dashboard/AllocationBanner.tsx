import { AllocationBannerProps } from "@/types/dashboard";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { PiggyBank, Sparkles, Loader2, X } from "lucide-react";
import { formatWithCommas, getCurrencySymbol } from "@/lib/dashboard/utils";
import { useState } from "react";
import { initializeSavings } from "@/lib/api/dashboard";

export function AllocationBanner({ data, plannedSavings, onRefresh }: AllocationBannerProps) {
    // Get currency code
    const { currency_code } = data.financial_overview

    // Get currency symbol
    const currencySymbol = getCurrencySymbol(currency_code)

    // State for submitting
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Visible state
    const [isVisible, setIsVisible] = useState<boolean>(true);

    // Success state
    const [isSuccess, setIsSuccess] = useState<boolean>(false)

    // Don't show if dismissed or nothing to show
    if (!isVisible || plannedSavings <= 0) return null;

    // Function to handle initialization
    async function handleAction() {
        // Set submitting state to true
        setIsSubmitting(true)
        try {
            // API function
            await initializeSavings()

            // Set success state to true
            setIsSuccess(true)

            // Refresh dashboard
            setTimeout(() => {
                onRefresh()
            }, 800)
        } catch (error: any) {
            alert("Sorry, we couldn't move your savings. Please try again.")
            console.error("Allocation failed", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="relative overflow-hidden border-2 border-dashed border-[#2E6B6B]/30 bg-[#f8fcfc] p-6 mb-6 transition-all animate-in fade-in slide-in-from-top-4">
            <button
                onClick={() => setIsVisible(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-gray-900 transition-colors"
            >
                <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row">
                    <div className="h-14 w-14 bg-[#2E6B6B] rounded-2xl flex items-center justify-center shadow-lg shadow-[#2E6B6B]/20 rotate-3 group-hover:rotate-0 transition-transform">
                        <PiggyBank className="h-7 w-7 text-white" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-gray-900 flex items-center justify-center md:justify-start gap-2">
                            Pay yourself first! <Sparkles className="h-4 w-4 text-[#2E6B6B]" />
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1 max-w-md">
                            It's a new month. Would you like to automatically allocate your
                            <span className="font-semibold text-[#2E6B6B]"> {currencySymbol}{formatWithCommas(Number(plannedSavings || 0).toFixed(0))} </span>
                            savings target now?
                        </p>
                    </div>
                </div>

                <Button
                    onClick={handleAction}
                    disabled={isSubmitting || isSuccess}
                    className={`px-8 h-11 font-medium shadow-md w-full md:w-auto transition-all duration-300 ${isSuccess
                        ? "bg-green-600 hover:bg-green-600 text-white"
                        : "bg-[#2E6B6B] hover:bg-[#2E6B6B]/90 text-white"
                        }`}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Allocating...
                        </>
                    ) : isSuccess ? (
                        <>
                            <div className="flex items-center gap-2 animate-in zoom-in duration-300">
                                <svg
                                    className="h-5 w-5 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Allocated!</span>
                            </div>
                        </>
                    ) : (
                        "Allocate Savings"
                    )}
                </Button>
            </div>
        </Card>
    )
}