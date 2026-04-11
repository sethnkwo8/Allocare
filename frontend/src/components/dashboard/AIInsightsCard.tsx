// AI Insights Card
export function AIInsightsCard({ insight, isLoading }: { insight: string, isLoading: boolean }) {
    return (
        <div className="bg-white/50 border border-blue-100 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2 mb-2">
                <span className="animate-pulse">✨</span> AI Financial Insight
            </h3>
            {isLoading ? (
                <div className="space-y-2 animate-pulse">
                    <div className="h-3 bg-blue-100 rounded w-full"></div>
                    <div className="h-3 bg-blue-100 rounded w-3/4"></div>
                </div>
            ) : (
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    "{insight}"
                </p>
            )}
        </div>
    )
}
