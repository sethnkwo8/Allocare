// Forgot Password client component

"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { resetPassword } from "@/lib/api/auth";

export default function ResetPassword() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Visibility states
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (!token) {
            toast.error("Invalid or missing reset token");
            return;
        }

        setIsLoading(true);

        try {
            await resetPassword(token, password)

            setIsSuccess(true);
            toast.success("Password updated successfully!");

            // Redirect to login
            setTimeout(() => {
                router.push("/login");
            }, 3000);

        } catch (error: any) {
            toast.error(error.message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4">
                <div className="max-w-md w-full text-center space-y-4 p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-center">
                        <CheckCircle2 className="h-12 w-12 text-[#2E6B6B]" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">All set!</h2>
                    <p className="text-gray-500">Your password has been reset. Redirecting you to login...</p>
                    <Button
                        onClick={() => router.push("/login")}
                        className="w-full bg-[#2E6B6B] hover:bg-[#245858]"
                    >
                        Go to login now
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Set new password</h2>
                    <p className="mt-2 text-sm text-gray-500">Must be at least 8 characters long.</p>
                </div>
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    {/* New Password Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">New Password</label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-12 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="h-12 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || !token}
                        className="w-full h-12 bg-[#2E6B6B] hover:bg-[#245858] text-white"
                    >
                        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Reset password"}
                    </Button>
                </form>
            </div>
        </div>
    );
}