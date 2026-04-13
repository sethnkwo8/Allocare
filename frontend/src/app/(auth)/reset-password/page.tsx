// Reset password page
import ResetPassword from "@/components/auth/ResetPassword";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

// Metadata title
export const metadata = { title: "Reset Password" };

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-[#2E6B6B]" />
            </div>
        }>
            <ResetPassword />
        </Suspense>
    )
}