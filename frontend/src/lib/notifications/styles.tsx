// Notification styles

import {
    PartyPopper,
    Trophy,
    Target,
    AlertTriangle,
    Info,
    PieChart,
    Bell
} from "lucide-react"

export const NOTIFICATION_STYLES: Record<string, { icon: any, color: string, bg: string }> = {
    welcome: {
        icon: Info,
        color: "text-blue-600",
        bg: "bg-blue-50"
    },
    goal_created: {
        icon: Target,
        color: "text-[#2E6B6B]",
        bg: "bg-[#2E6B6B]/10"
    },
    goal_milestone: {
        icon: PartyPopper,
        color: "text-indigo-600",
        bg: "bg-indigo-50"
    },
    goal_completed: {
        icon: Trophy,
        color: "text-amber-600",
        bg: "bg-amber-50"
    },
    budget_summary: {
        icon: PieChart,
        color: "text-emerald-600",
        bg: "bg-emerald-50"
    },
    budget_exceeded: {
        icon: AlertTriangle,
        color: "text-red-600",
        bg: "bg-red-50"
    },
}