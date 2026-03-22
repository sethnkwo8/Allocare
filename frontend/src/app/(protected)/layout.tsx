import { AuthGuard } from "@/components/auth/AuthGuard"
import { Metadata } from "next"

// Metadata for protected routes
export const metadata: Metadata = {
    title: {
        template: "%s || Allocare", // %s is used as a placeholder
        default: "Allocare",
    },
    description: "Securely access your Allocare budget account.",
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return <AuthGuard>
        {children}
    </AuthGuard>
}