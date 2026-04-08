// Profile settings custom hook
import { BudgetSettingsData } from "@/types/profile-settings";
import { useEffect, useState, useCallback } from "react"

export function useProfileSettings() {
    const [data, setData] = useState<BudgetSettingsData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorData, setErrorData] = useState<string | null>(null);
    const apiURL = process.env.NEXT_PUBLIC_API_URL

    // Function to fetch profile settings from endpoint
    const fetchProfileSettingsData = useCallback(async () => {
        setIsLoading(true)
        setErrorData(null)

        try {
            const res = await fetch(`${apiURL}/auth/budget-configuration`, {
                credentials: "include"
            });

            if (!res.ok) {
                throw new Error("Failed to fetch budget configurations");
            }

            const result = await res.json()
            setData(result)
            console.log(result)
        } catch (error: any) {
            setErrorData(error.message)
        } finally {
            setIsLoading(false)
        }

    }, [apiURL])

    useEffect(() => {
        fetchProfileSettingsData()
    }, [fetchProfileSettingsData])

    return { data, isLoading, errorData, refresh: fetchProfileSettingsData }
}