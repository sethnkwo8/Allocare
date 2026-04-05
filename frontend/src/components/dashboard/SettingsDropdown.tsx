// Settings dropdown
"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown"
import { Button } from "../ui/button"
import { LogOut, Settings, User } from "lucide-react"
import { logoutUser } from "@/lib/api/auth"
import { useRouter } from "next/navigation"

export function SettingsDropdown() {
    const router = useRouter()

    // Handle logout function
    async function handleLogout() {
        try {
            // logout
            await logoutUser()
            router.push('/login')
        } catch (error: any) {
            alert(error.message)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Settings className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => console.log("Open Profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    onClick={() => {
                        // Logout user
                        handleLogout()
                    }}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
