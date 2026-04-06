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