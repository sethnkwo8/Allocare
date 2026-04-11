// Custom hook for AI insight
import { useState, useEffect } from 'react';
import { fetchInsight } from '@/lib/api/ai-insights';

export function useAiInsight() {
    const [insight, setInsight] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function getInsight() {
            try {
                const data = await fetchInsight();
                if (isMounted) setInsight(data.insight);
            } catch (err: any) {
                if (isMounted) {
                    setError(err);
                    // Fallback
                    setInsight("AI Financial Insights are coming soon! Keep tracking your expenses to unlock personalized tips.");
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        getInsight();
        return () => { isMounted = false; };
    }, []);

    return { insight, isLoading, error };
}