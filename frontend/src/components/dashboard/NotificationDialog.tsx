// Notification Dialog
"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Bell, Loader2, CheckCheck } from "lucide-react" // Added CheckCheck icon
import { Button } from "../ui/button"
import { NotificationDialogProps } from "@/types/dashboard"
import { NOTIFICATION_STYLES } from "@/lib/notifications/styles"
import { markAsRead, markAllAsRead } from "@/lib/api/dashboard" // Import both
import { useState } from "react"

export function NotificationDialog({ data, isNotificationsOpen, setIsNotificationsOpen, refresh }: NotificationDialogProps) {
    const { notifications } = data
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [isMarkingAll, setIsMarkingAll] = useState(false)

    // Check if there are actually any unread notifications
    const hasUnread = notifications.some(n => !n.is_read)

    async function handleNotificationClick(id: string, isRead: boolean) {
        if (isRead) return;
        setLoadingId(id)
        try {
            await markAsRead(id)
            refresh();
        } catch (error) {
            console.error("Failed to mark as read:", error)
        } finally {
            setLoadingId(null)
        }
    }

    async function handleMarkAll() {
        if (!hasUnread || isMarkingAll) return;

        setIsMarkingAll(true)
        try {
            await markAllAsRead()
            refresh();
        } catch (error) {
            console.error("Failed to mark all as read:", error)
        } finally {
            setIsMarkingAll(false)
        }
    }

    return (
        <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <div className="space-y-1">
                        <DialogTitle>Notifications</DialogTitle>
                        <DialogDescription>
                            Stay updated with your activities.
                        </DialogDescription>
                    </div>
                    {/* Mark All as Read Button */}
                    {hasUnread && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAll}
                            disabled={isMarkingAll}
                            className="text-[#2E6B6B] hover:text-[#245252] hover:bg-[#2E6B6B]/10 h-8 px-2 mr-6"
                        >
                            {isMarkingAll ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <div className="flex items-center gap-1">
                                    <CheckCheck className="h-4 w-4" />
                                    <span className="text-xs">Mark all</span>
                                </div>
                            )}
                        </Button>
                    )}
                </DialogHeader>

                <div className="space-y-3 max-h-100 overflow-y-auto pr-2">
                    {notifications.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground">
                            <Bell className="mx-auto h-8 w-8 opacity-20 mb-2" />
                            <p>No notifications yet.</p>
                        </div>
                    ) : (
                        notifications.map((notification) => {
                            const style = NOTIFICATION_STYLES[notification.type] || {
                                icon: Bell,
                                color: "text-gray-600",
                                bg: "bg-gray-50"
                            }
                            const Icon = style.icon
                            const isCurrentlyMarking = loadingId === notification.id

                            return (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification.id, notification.is_read)}
                                    className={`p-4 border rounded-xl transition-all cursor-pointer group
                                        ${!notification.is_read
                                            ? 'bg-white shadow-sm border-[#2E6B6B]/10 hover:border-[#2E6B6B]/40'
                                            : 'bg-gray-50/50 border-transparent hover:bg-gray-50'
                                        } ${isCurrentlyMarking || isMarkingAll ? 'opacity-60 pointer-events-none' : ''}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${style.bg}`}>
                                            {isCurrentlyMarking ? (
                                                <Loader2 className="h-5 w-5 animate-spin text-[#2E6B6B]" />
                                            ) : (
                                                <Icon className={`h-5 w-5 ${style.color}`} />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div className={`text-sm font-semibold ${!notification.is_read ? 'text-gray-900' : 'text-gray-500'}`}>
                                                    {notification.title}
                                                </div>
                                                {!notification.is_read && !isCurrentlyMarking && (
                                                    <span className="h-2 w-2 rounded-full bg-[#2E6B6B] mt-1.5" />
                                                )}
                                            </div>
                                            <div className="text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                                                {notification.message}
                                            </div>
                                            <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mt-3">
                                                {new Date(notification.created_at).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                <div className="flex justify-end mt-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsNotificationsOpen(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}