import { AuthGuard } from "@/components/auth/AuthGuard"
import { Metadata } from "next"

// Metadata for auth routes
export const metadata: Metadata = {
    title: "Onboarding || Allocare",
    description: "Set up your Allocare budget details.",
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return <AuthGuard>
        {children}
    </AuthGuard>
}