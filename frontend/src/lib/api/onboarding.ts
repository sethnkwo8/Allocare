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