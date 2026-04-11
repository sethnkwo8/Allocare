// API call for OpenAI insights
export async function fetchInsight() {
    const apiURL = process.env.NEXT_PUBLIC_API_URL

    const res = await fetch(`${apiURL}/ai-insights/monthly`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        }
    })

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to get AI insights")
    }

    return await res.json()
}