import { HeaderProps } from "@/types/dashboard"
import { Button } from "../ui/button"
import { Bell, RefreshCw } from "lucide-react"
import { SettingsDropdown } from "./SettingsDropdown"

export function Header({ data, onRefresh }: HeaderProps) {
    // Get user's name
    const { name } = data.financial_overview

    // Get notification unread count
    const { unread_count } = data

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

                <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unread_count.unread_count > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#2E6B6B] text-[10px] font-bold text-white ring-2 ring-white">
                            {unread_count.unread_count > 9 ? '9+' : unread_count.unread_count}
                        </span>
                    )}
                </Button>

                <SettingsDropdown />

            </div>
        </div>
    )
}