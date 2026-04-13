// Onboarding Steps
"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CurrencyStep } from "@/components/onboarding/CurrencyStep"
import { OnboardingData } from "@/types/onboarding"
import { CompleteOnboarding, SetCurrency } from "@/lib/api/onboarding"
import { SetIncomeFrequency } from "@/lib/api/onboarding"
import { IncomeFrequencyStep } from "@/components/onboarding/IncomeFrequencyStep"
import { currencySymbols } from "@/lib/onboarding/currency"
import { MainAllocationStep } from "./MainAllocationStep"
import { CategoryBreakdownStep } from "./CategoryBreakdownStep"
import { needsCategories, wantsCategories, savingsCategories } from "@/lib/onboarding/default_categories"
import { CheckCircle2 } from "lucide-react";

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function OnboardingSteps() {
    const router = useRouter()

    // State for current step
    const [currentStep, setCurrentStep] = useState<number>(1)

    // Loading state
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // State for is onboarding complete
    const [isComplete, setIsComplete] = useState<boolean>(false)

    // Error data
    const [errorMessage, setErrorMessage] = useState<string>("")

    // Form Data state
    const [data, setData] = useState<OnboardingData>({
        currency: "",
        income: "",
        frequency: "",
        mainAllocation: {
            needs: 50,
            wants: 30,
            savings: 20,
        },
        needsBreakdown: {
            housing: 40,
            groceries: 20,
            utilities: 15,
            transportation: 10,
            healthcare: 5,
            tithe: 10,
            otherNeeds: 0,
        },
        wantsBreakdown: {
            entertainment: 20,
            diningOut: 25,
            shopping: 30,
            travel: 15,
            fitness: 5,
            otherWants: 5,
        },
        savingsBreakdown: {
            emergency: 30,
            retirement: 35,
            investments: 20,
            goals: 10,
            otherSavings: 5,
        },
    });

    // Total steps
    const totalSteps = 6

    // Calculate progress
    const progress = (currentStep / totalSteps) * 100

    // Get currency symbol
    const currencySymbol = currencySymbols[data.currency] || "$";

    // Convert income value to float
    const incomeValue = parseFloat(data.income) || 0;

    // Calculate needs amount
    const needsAmount = (incomeValue * data.mainAllocation.needs) / 100;

    // Calculate wants amount
    const wantsAmount = (incomeValue * data.mainAllocation.wants) / 100;

    // Calculate savings amount
    const savingsAmount = (incomeValue * data.mainAllocation.savings) / 100;

    // Switch function to check if user can proceed
    function canProceed() {
        switch (currentStep) {
            case 1:
                return data.currency !== "";
            case 2:
                return data.income !== "" && parseFloat(data.income) > 0 && data.frequency !== "";
            case 3:
                const mainTotal = data.mainAllocation.needs + data.mainAllocation.wants + data.mainAllocation.savings;
                return mainTotal === 100;
            case 4:
                const needsTotal = Object.values(data.needsBreakdown).reduce((sum, val) => sum + val, 0);
                return needsTotal === 100;
            case 5:
                const wantsTotal = Object.values(data.wantsBreakdown).reduce((sum, val) => sum + val, 0);
                return wantsTotal === 100;
            case 6:
                const savingsTotal = Object.values(data.savingsBreakdown).reduce((sum, val) => sum + val, 0);
                return savingsTotal === 100;
            default:
                return false;
        }
    };

    // Handle back button function
    function handleBack(e: React.MouseEvent<HTMLButtonElement>) {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Handle next button function
    async function handleNext(e: React.MouseEvent<HTMLButtonElement>) {
        // Clear old error messages
        setErrorMessage("")

        // Switch statement for steps
        switch (currentStep) {
            case 1:
                // Set Currency
                setIsLoading(true)
                try {
                    await SetCurrency(data.currency)
                    setCurrentStep(2) // advance if api call succeds
                } catch (error: any) {
                    setErrorMessage(error.message || "Failed to save currency.")
                } finally {
                    setIsLoading(false)
                }
                break;
            case 2:
                // Set income and frequency
                setIsLoading(true)
                try {
                    await SetIncomeFrequency(data.income, data.frequency)
                    setCurrentStep(3) // advance if api call succeds
                } catch (error: any) {
                    setErrorMessage(error.message || "Failed to save income and frequency.")
                } finally {
                    setIsLoading(false)
                }
                break;
            case 3:
                setCurrentStep(4);
                break;
            case 4:
                setCurrentStep(5)
                break;
            case 5:
                setCurrentStep(6);
                break;
            case 6:
                // Finalize onboarding
                if (isLoading) return;
                setIsLoading(true)
                try {
                    await CompleteOnboarding(data)
                    setIsComplete(true)
                } catch (error: any) {
                    setErrorMessage(error.message || "Failed to complete onboarding")
                } finally {
                    setIsLoading(false)
                }
                break;
            default:
                if (currentStep < totalSteps) {
                    setCurrentStep(currentStep + 1);
                }
                break;
        }
    };

    if (isComplete) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-[#d4f1f1] to-[#e6f5f5]">
                <Card className="max-w-2xl w-full p-6 sm:p-8 text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-10 w-10 text-primary" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-bold">All Set!</h2>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            Your financial profile has been created successfully
                        </p>
                    </div>

                    <div className="space-y-4 text-left">
                        <div className="bg-accent p-4 rounded-lg space-y-3">
                            <h3 className="font-medium text-sm sm:text-base">Basic Information</h3>
                            <div className="grid grid-cols-1 xs:grid-cols-3 gap-4 text-sm">
                                <div className="flex justify-between xs:block">
                                    <span className="text-muted-foreground block">Currency</span>
                                    <span className="font-medium">{data.currency}</span>
                                </div>
                                <div className="flex justify-between xs:block">
                                    <span className="text-muted-foreground block">Income</span>
                                    <span className="font-medium truncate block">{currencySymbol}{data.income.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between xs:block">
                                    <span className="text-muted-foreground block">Frequency</span>
                                    <span className="font-medium capitalize">{data.frequency}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                                { label: "Needs", value: data.mainAllocation.needs, amount: needsAmount, color: "blue" },
                                { label: "Wants", value: data.mainAllocation.wants, amount: wantsAmount, color: "purple" },
                                { label: "Savings", value: data.mainAllocation.savings, amount: savingsAmount, color: "green" }
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className={`bg-${item.color}-50 p-4 rounded-lg border border-${item.color}-100 flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-2`}
                                >
                                    <div className="text-left">
                                        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{item.label}</div>
                                        <div className={`text-xl sm:text-2xl font-bold text-${item.color}-600`}>
                                            {item.value}%
                                        </div>
                                    </div>
                                    <div className="text-right sm:text-left">
                                        <div className="text-sm font-semibold text-gray-700 break-all">
                                            {currencySymbol}{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button onClick={() => router.push('/dashboard')} className="w-full py-6 text-lg shadow-lg">
                        Go to Dashboard
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-[#d4f1f1] to-[#e6f5f5]">
            <Card className="max-w-3xl w-full p-8">
                <div className="space-y-8">
                    {/* Progress Header */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                                Step {currentStep} of {totalSteps}
                            </span>
                            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>

                    {/* Step Content */}
                    <div className="min-h-100 flex items-center justify-center">
                        {currentStep === 1 && (
                            <CurrencyStep
                                value={data.currency}
                                onChange={(value) => setData(
                                    { ...data, currency: value })}
                            />
                        )}
                        {currentStep === 2 && (
                            <IncomeFrequencyStep
                                income={data.income}
                                frequency={data.frequency}
                                onIncomeChange={(value) => setData({ ...data, income: value })}
                                onFrequencyChange={(value) => setData({ ...data, frequency: value })}
                                currencySymbol={currencySymbol}
                            />
                        )}
                        {currentStep === 3 && (
                            <MainAllocationStep
                                allocations={data.mainAllocation}
                                onChange={(allocations) => setData({ ...data, mainAllocation: allocations })}
                                currencySymbol={currencySymbol}
                                income={data.income}
                            />
                        )}
                        {currentStep === 4 && (
                            <CategoryBreakdownStep
                                title="Break down your needs"
                                categories={needsCategories}
                                breakdown={data.needsBreakdown}
                                onChange={(breakdown) => setData({ ...data, needsBreakdown: breakdown })}
                                currencySymbol={currencySymbol}
                                categoryAmount={needsAmount}
                                colorClass="text-blue-600"
                            />
                        )}
                        {currentStep === 5 && (
                            <CategoryBreakdownStep
                                title="Break down your wants"
                                categories={wantsCategories}
                                breakdown={data.wantsBreakdown}
                                onChange={(breakdown) => setData({ ...data, wantsBreakdown: breakdown })}
                                currencySymbol={currencySymbol}
                                categoryAmount={wantsAmount}
                                colorClass="text-purple-600"
                            />
                        )}
                        {currentStep === 6 && (
                            <CategoryBreakdownStep
                                title="Break down your savings"
                                categories={savingsCategories}
                                breakdown={data.savingsBreakdown}
                                onChange={(breakdown) => setData({ ...data, savingsBreakdown: breakdown })}
                                currencySymbol={currencySymbol}
                                categoryAmount={savingsAmount}
                                colorClass="text-green-600"
                            />
                        )}
                    </div>
                    {/* Error Message */}
                    {errorMessage && (
                        <p className="text-sm text-red-500 bg-red-50 p-3 rounded-md border border-red-200">
                            {errorMessage}
                        </p>
                    )}
                    {/* Navigation Buttons */}
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            className="flex-1"
                        >
                            Back
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={isLoading || !canProceed()}
                            className="flex-1"
                        >
                            {isLoading ? "Saving..." : (currentStep === totalSteps ? "Complete" : "Continue")}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
