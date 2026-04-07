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