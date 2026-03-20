// Onboarding Page
"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CurrencyStep } from "@/components/onboarding/CurrencyStep"
import { OnboardingData } from "@/types/onboarding"

import { useState } from "react"

export default function OnboardingPage() {
    // State for current step
    const [currentStep, setCurrentStep] = useState<number>(1)

    // State for is onboarding complete
    const [isComplete, setIsComplete] = useState<boolean>(false)

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
            groceries: 25,
            utilities: 15,
            transportation: 10,
            healthcare: 5,
            otherNeeds: 5,
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

    // Handle back button function
    function handleBack(e: React.MouseEvent<HTMLButtonElement>) {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Handle next button function
    function handleNext(e: React.MouseEvent<HTMLButtonElement>) {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsComplete(true);
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
                                onChange={(value) => setData({ ...data, currency: value })}
                            />
                        )}
                    </div>
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
                            // disabled={!canProceed()}
                            className="flex-1"
                        >
                            {currentStep === totalSteps ? "Complete" : "Continue"}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
