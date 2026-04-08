// API call to update budget allocations
export async function UpdateBudgetSettings(payload: any) {
    // Get api url
    const apiURL = process.env.NEXT_PUBLIC_API_URL;

    const res = await fetch(`${apiURL}/auth/budget-configuration`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to update budget settings");
    }

    return await res.json();
}