import { HeaderProps } from "@/types/dashboard"
import { Button } from "../ui/button"
import { Bell, Plus, RefreshCw } from "lucide-react"
import { SettingsDropdown } from "./SettingsDropdown"
import { useState } from "react"
import { NotificationDialog } from "./NotificationDialog"

export function Header({ data, setIsExpenseDialogOpen, onRefresh }: HeaderProps) {
    // Get user's name
    const { name } = data.financial_overview

    // Get notification unread count
    const { unread_count } = data

    // Get the current month
    const currentMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date());

    // State for notification dialog
    const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false)

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-semibold text-[#2E6B6B]">Welcome back, {name}!</h1>
                <p className="text-muted-foreground">
                    Here's your financial overview for <span className="text-[#2E6B6B] font-medium">{currentMonth}</span>
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <Button
                    className="flex-1 md:flex-none bg-[#2E6B6B] hover:bg-[#2E6B6B]/90 text-white h-11"
                    onClick={() => setIsExpenseDialogOpen(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expense
                </Button>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onRefresh}
                        className="h-11 w-11 hover:text-[#2E6B6B] hover:border-[#2E6B6B]"
                        title="Refresh Data"
                    >
                        <RefreshCw className="h-5 w-5" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        className="relative h-11 w-11"
                        onClick={() => setIsNotificationsOpen(true)}
                    >
                        <Bell className="h-5 w-5" />
                        {unread_count.unread_count > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#2E6B6B] text-[10px] font-bold text-white ring-2 ring-white">
                                {unread_count.unread_count > 9 ? '9+' : unread_count.unread_count}
                            </span>
                        )}
                    </Button>

                    <SettingsDropdown />
                </div>
            </div>

            {/* Notifications dialog */}
            <NotificationDialog
                data={data}
                isNotificationsOpen={isNotificationsOpen}
                setIsNotificationsOpen={setIsNotificationsOpen}
                refresh={onRefresh}
            />
        </div>
    )
}