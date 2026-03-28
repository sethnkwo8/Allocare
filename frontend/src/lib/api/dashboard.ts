import { ExpenseForm, GoalForm } from "@/types/dashboard";

// API call to create an expense
export async function createExpense(data: ExpenseForm) {
    const apiURL = process.env.NEXT_PUBLIC_API_URL

    const res = await fetch(`${apiURL}/expenses/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            title: data.title,
            amount: parseFloat(data.amount),
            category_id: data.category,
            notes: data.description
        })
    })

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail[0].msg || "Failed to add expense")
    }

    return await res.json()
}

// API call to create goal
export async function createGoal(data: GoalForm) {
    const apiURL = process.env.NEXT_PUBLIC_API_URL

    const res = await fetch(`${apiURL}/goals/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: data.name,
            target_amount: data.target_amount,
            target_date: data.target_date ? new Date(data.target_date).toISOString() : null,
            description: data.description || null
        })
    })

    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.detail[0].msg || "Failed to add goal")
    }

    return await res.json()
}