// Notification Manager
"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { getPendingToasts } from "@/lib/api/dashboard";

export default function NotificationManager() {
    useEffect(() => {
        const pollToasts = async () => {
            try {
                const newToasts = await getPendingToasts();

                if (!newToasts || !Array.isArray(newToasts)) return;

                newToasts.forEach((note) => {
                    toast.info(note.title, {
                        description: note.message,
                        icon: note.type.includes('COMPLETED') ? "🎉" : "📈",
                    });
                });
            } catch (error) {
                console.error("Polling error:", error);
            }
        };

        const interval = setInterval(pollToasts, 30000);
        pollToasts();

        return () => clearInterval(interval);
    }, []);

    return null;
}