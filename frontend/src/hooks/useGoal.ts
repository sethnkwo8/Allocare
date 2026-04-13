// useGoal custom hook
import { GoalResponse } from "@/types/goals";
import { useEffect, useState, useCallback } from "react";

export function useGoal() {
    const [data, setData] = useState<GoalResponse[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorData, setErrorData] = useState<string | null>(null);
    const apiURL = process.env.NEXT_PUBLIC_API_URL

    // Function to fetch goals data from endpoint
    const fetchGoalData = useCallback(async () => {
        setIsLoading(true)
        setErrorData(null)

        try {
            const res = await fetch(`${apiURL}/goals/`, {
                credentials: "include"
            });

            if (!res.ok) {
                throw new Error("Failed to fetch goals data");
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
        fetchGoalData()
    }, [fetchGoalData])

    return { data, isLoading, errorData, refresh: fetchGoalData }
}