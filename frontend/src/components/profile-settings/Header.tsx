// Profile settings heading
"use client"

import { ProfileSettingsHeaderProps } from "@/types/profile-settings"
import { Button } from "../ui/button"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function Header({ onSave, hasChanges, isSaving, handleBackNavigation }: ProfileSettingsHeaderProps) {
    // Router constant
    const router = useRouter()

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleBackNavigation}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="font-semibold text-3xl text-[#2E6B6B]">Profile Settings</h1>
                    <p className="text-sm text-muted-foreground">Update your budget allocations</p>
                </div>
            </div>

            <Button
                className="bg-[#2E6B6B] hover:bg-[#2E6B6B]/90 text-white"
                onClick={onSave}
                disabled={!hasChanges || isSaving}
            >
                {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                    <Save className="h-4 w-4 mr-2" />
                )}
                {isSaving ? "Saving..." : "Save Changes"}
            </Button>
        </div>
    )
}
