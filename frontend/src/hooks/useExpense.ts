// useExpense custom hook
import { ExpenseResponse } from "@/types/expense";
import { useEffect, useState, useCallback } from "react"

export function useExpense() {
    const [data, setData] = useState<ExpenseResponse[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorData, setErrorData] = useState<string | null>(null);
    const apiURL = process.env.NEXT_PUBLIC_API_URL

    // Function to fetch dashboard data from endpoint
    const fetchExpensesData = useCallback(async () => {
        setIsLoading(true)
        setErrorData(null)

        try {
            const res = await fetch(`${apiURL}/expenses`, {
                credentials: "include"
            });

            if (!res.ok) {
                throw new Error("Failed to fetch expenses data");
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
        fetchExpensesData()
    }, [fetchExpensesData])

    return { data, isLoading, errorData, refresh: fetchExpensesData }
}