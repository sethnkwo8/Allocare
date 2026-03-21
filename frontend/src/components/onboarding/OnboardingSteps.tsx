// Onboarding Steps
"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CurrencyStep } from "@/components/onboarding/CurrencyStep"
import { OnboardingData } from "@/types/onboarding"
import { SetCurrency } from "@/lib/api/onboarding"
import { SetIncomeFrequency } from "@/lib/api/onboarding"
import { IncomeFrequencyStep } from "@/components/onboarding/IncomeFrequencyStep"
import { currencySymbols } from "@/lib/onboarding/currency"
import { MainAllocationStep } from "./MainAllocationStep"
import { CategoryBreakdownStep } from "./CategoryBreakdownStep"
import { needsCategories } from "@/lib/onboarding/default_categories"

import { useState } from "react"

export default function OnboardingSteps() {
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
            default:
                if (currentStep < totalSteps) {
                    setCurrentStep(currentStep + 1);
                }
                break;
        }
    };

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
                                colorClass="text-purple-600"
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
