// Custom hook for AI insight
import { useState, useEffect } from 'react';
import { fetchInsight } from '@/lib/api/ai-insights';

export function useAiInsight() {
    const [insight, setInsight] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        async function getInsight() {
            const data = await fetchInsight();
            if (isMounted) {
                if (data.insight) {
                    setInsight(data.insight);
                } else {
                    setInsight("AI Financial Insights are currently unavailable. Keep tracking to unlock tips soon!");
                }
                setIsLoading(false);
            }
        }
        getInsight();
        return () => { isMounted = false; };
    }, []);

    return { insight, isLoading };
}