import { DashboardResponse, HeaderProps } from "@/types/dashboard"
import { Button } from "../ui/button"
import { Bell, RefreshCw, Settings } from "lucide-react"

export function Header({ data, onRefresh }: HeaderProps) {
    const { name } = data.financial_overview

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-semibold text-[#2E6B6B]">Welcome back, {name}!</h1>
                <p className="text-muted-foreground">Here's your monthly financial overview</p>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onRefresh}
                    className="hover:text-[#2E6B6B] hover:border-[#2E6B6B]"
                    title="Refresh Data"
                >
                    <RefreshCw className="h-5 w-5" />
                </Button>

                <Button className="bg-[#2E6B6B] hover:bg-[#2E6B6B]/90 text-white">
                    Edit Income
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