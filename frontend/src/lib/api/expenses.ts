import { ExpenseForm } from "@/types/dashboard";

// API call to delete expense
export async function deleteExpense(expenseId: string) {
    const apiURL = process.env.NEXT_PUBLIC_API_URL

    const res = await fetch(`${apiURL}/expenses/${expenseId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.detail?.[0]?.msg || errorData.detail || "Failed to delete expense";
        throw new Error(errorMessage)
    }

    return true
}

// API call to edit expense
export async function updateExpense(expenseId: string, data: ExpenseForm) {
    const apiURL = process.env.NEXT_PUBLIC_API_URL

    // Prepare the payload by mapping frontend keys to backend schema keys
    const payload = {
        title: data.title || undefined,
        // Convert string to number, ensure it's not an empty string or NaN
        amount: data.amount ? parseFloat(data.amount) : undefined,
        // Ensure category_id is a valid UUID string, not an empty string
        category_id: data.category && data.category !== "" ? data.category : undefined,
        notes: data.description || undefined,
    };

    const res = await fetch(`${apiURL}/expenses/${expenseId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    })

    if (!res.ok) {
        const errorData = await res.json()
        // Log the actual detail to see EXACTLY which field failed in your console
        console.error("FastAPI 422 Detail:", errorData.detail);

        const errorMessage = errorData.detail?.[0]?.msg || errorData.detail || "Failed to edit expense";
        throw new Error(errorMessage)
    }

    return await res.json()
}