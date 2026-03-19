// Auth Layout
import { Metadata } from "next"

// Metadata for auth routes
export const metadata: Metadata = {
    title: {
        template: "%s || Allocare", // %s is used as a placeholder
        default: "Auth || Allocare",
    },
    description: "Securely access your Allocare budget account.",
}

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            {children}
        </div>
    )
}