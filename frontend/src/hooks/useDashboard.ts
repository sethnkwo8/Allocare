// useDashboard custom hook
"use client"
import { DashboardResponse } from "@/types/dashboard"
import { useEffect, useState, useCallback } from "react"

export function useDashboard() {
    const [data, setData] = useState<DashboardResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorData, setErrorData] = useState<string | null>(null);
    const apiURL = process.env.NEXT_PUBLIC_API_URL

    // Function to fetch dashboard data from endpoint
    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true)
        setErrorData(null)

        try {
            const res = await fetch(`${apiURL}/dashboard`, {
                credentials: "include"
            });

            if (!res.ok) {
                throw new Error("Failed to fetch dashboard data");
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
        fetchDashboardData()
    }, [fetchDashboardData])

    return { data, isLoading, errorData, refresh: fetchDashboardData }
}
