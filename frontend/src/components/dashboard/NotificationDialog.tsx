// Notification Dialog
"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Bell } from "lucide-react"
import { Button } from "../ui/button"
import { NotificationDialogProps } from "@/types/dashboard"
import { NOTIFICATION_STYLES } from "@/lib/notifications/styles"

export function NotificationDialog({ data, isNotificationsOpen, setIsNotificationsOpen }: NotificationDialogProps) {

    const { notifications } = data

    return (
        <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Notifications</DialogTitle>
                    <DialogDescription>
                        Stay updated with your financial activities.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 max-h-100 overflow-y-auto pr-2">
                    {notifications.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground">
                            <Bell className="mx-auto h-8 w-8 opacity-20 mb-2" />
                            <p>No notifications yet.</p>
                        </div>
                    ) : (
                        notifications.map((notification) => {
                            // Fallback to a default style if the type doesn't match
                            const style = NOTIFICATION_STYLES[notification.type] || {
                                icon: Bell,
                                color: "text-gray-600",
                                bg: "bg-gray-50"
                            }
                            const Icon = style.icon

                            return (
                                <div
                                    key={notification.id}
                                    className={`p-4 border rounded-xl transition-all hover:border-[#2E6B6B]/30 ${!notification.is_read ? 'bg-white shadow-sm' : 'bg-gray-50/50'}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${style.bg}`}>
                                            <Icon className={`h-5 w-5 ${style.color}`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div className="font-semibold text-sm text-gray-900">{notification.title}</div>
                                                {!notification.is_read && (
                                                    <span className="h-2 w-2 rounded-full bg-[#2E6B6B]" />
                                                )}
                                            </div>
                                            <div className="text-sm text-muted-foreground mt-1 leading-relaxed">
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