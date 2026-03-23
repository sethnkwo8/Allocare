import { DashboardResponse } from "@/types/dashboard"
import { Button } from "../ui/button"
import { Bell, Plus, Settings } from "lucide-react"

export function Header({ data }: { data: DashboardResponse }) {
    const { name } = data.financial_overview

    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl">Welcome back, {name}!</h1>
                <p className="text-muted-foreground">Here's your monthly financial overview</p>
            </div>
            <div className="flex gap-2">
                <Button className="bg-[#2E6B6B] hover:bg-[#2E6B6B]/90 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Income
                </Button>
                <Button variant="outline" size="icon">
                    <Bell className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                    <Settings className="h-5 w-5" />
                </Button>
            </div>
        </div>
    )
}