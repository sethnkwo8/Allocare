import { OnboardingData } from "@/types/onboarding";
import { needsCategories, wantsCategories, savingsCategories } from "../onboarding/default_categories";
import { formatCategories } from "../utils";

// Set currency api function
export async function SetCurrency(currency: string) {
    const apiURL = process.env.NEXT_PUBLIC_API_URL

    const res = await fetch(`${apiURL}/onboarding/currency`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ currency: currency })
    })

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail[0].msg || "Currency Setup Failed")
    }

    return await res.json()
}

// Set income amount and frequency api function
export async function SetIncomeFrequency(income: string, frequency: string) {
    const apiURL = process.env.NEXT_PUBLIC_API_URL

    const res = await fetch(`${apiURL}/onboarding/income`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            amount: parseFloat(income),
            frequency: frequency
        })
    })

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail[0].msg || "Income & Frequency Setup Failed")
    }

    return await res.json()
}

// Complete onboarding api function
export async function CompleteOnboarding(data: OnboardingData) {
    const apiURL = process.env.NEXT_PUBLIC_API_URL

    // Payload to be sent to backend
    const payload = {
        buckets: [
            {
                name: "needs",
                percentage_allocation: data.mainAllocation.needs,
                categories: formatCategories(data.needsBreakdown, needsCategories)
            },
            {
                name: "wants",
                percentage_allocation: data.mainAllocation.wants,
                categories: formatCategories(data.wantsBreakdown, wantsCategories)
            },
            {
                name: "savings",
                percentage_allocation: data.mainAllocation.savings,
                categories: formatCategories(data.savingsBreakdown, savingsCategories)
            }
        ]
    };

    const res = await fetch(`${apiURL}/onboarding/complete`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload)
    })

    if (!res.ok) {
        const errorData = await res.json()

        if (errorData.detail === "Onboarding process already completed") {
            return { message: "Onboarding complete" };
        }

        throw new Error(errorData.detail[0].msg || "Failed to finalize onboarding")
    }

    return await res.json()
}