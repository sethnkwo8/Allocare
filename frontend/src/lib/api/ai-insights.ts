// API call for OpenAI insights
export async function fetchInsight() {
    const apiURL = process.env.NEXT_PUBLIC_API_URL

    try {
        const res = await fetch(`${apiURL}/ai-insights/monthly`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        })

        if (!res.ok) {
            // If quota error return 
            if (res.status === 429) {
                return { insight: null, status: 429 };
            }
            throw new Error("Failed to get AI insights");
        }

        return await res.json();
    } catch (err) {
        console.error("AI Insight Fetch Error:", err);
        return { insight: null, error: true };
    }
}