import { GoalForm } from "@/types/dashboard";

// API call to delete expense
export async function deleteGoal(goalId: string) {
    const apiURL = process.env.NEXT_PUBLIC_API_URL

    const res = await fetch(`${apiURL}/goals/${goalId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.detail?.[0]?.msg || errorData.detail || "Failed to delete goal";
        throw new Error(errorMessage)
    }

    return true
}

// API call to edit goal
export async function updateGoal(goalId: string, data: GoalForm) {
    const apiURL = process.env.NEXT_PUBLIC_API_URL

    // Prepare the payload by mapping frontend keys to backend schema keys
    const payload = {
        name: data.name || undefined,
        // Convert string to number, ensure it's not an empty string or NaN
        target_amount: data.target_amount ? parseFloat(data.target_amount) : undefined,
        // Ensure category_id is a valid UUID string, not an empty string
        target_date: data.target_date,
        description: data.description || undefined,
    };

    const res = await fetch(`${apiURL}/goals/${goalId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.detail?.[0]?.msg || errorData.detail || "Failed to edit goal";
        throw new Error(errorMessage)
    }

    return await res.json()
}