// Dashboard
"use client"

import { useDashboard } from "@/hooks/useDashboard"
import { OverviewCards } from "./OverviewCards"
import { Header } from "./Header"

export function Dashboard() {
    const { data, isLoading, errorData, refresh } = useDashboard()

    if (isLoading) return <div>Loading your financial overview...</div>
    if (errorData) return <div>Error: {errorData}</div>
    if (!data) return null

    return (
        <div className="min-h-screen bg-linear-to-br from-[#d4f1f1] to-[#e6f5f5] p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <Header />

                {/* Overview Cards */}
                <OverviewCards data={data} />
            </div>
        </div>
    )
}
