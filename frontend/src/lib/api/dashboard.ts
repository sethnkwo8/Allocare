import { ExpenseForm } from "@/types/dashboard";

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