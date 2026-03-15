// Auth Layout
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#FAFAFA] px-6">
            {children}
        </div>
    )
}