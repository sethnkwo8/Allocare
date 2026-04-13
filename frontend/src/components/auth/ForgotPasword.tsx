// Forgot Password client component

"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { forgotPassword } from "@/lib/api/auth";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        try {
            await forgotPassword(email)

            // Popup
            toast.success("Check your email", {
                description: "If an account exists, a reset link has been sent.",
            });
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Forgot password?</h2>
                    <p className="mt-2 text-sm text-gray-500">No worries, we'll send you reset instructions.</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12"
                    />
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-[#2E6B6B] hover:bg-[#245858] text-white"
                    >
                        {isLoading ? "Sending..." : "Send reset link"}
                    </Button>
                </form>
                <div className="text-center">
                    <Link href="/login" className="text-sm font-medium text-[#2E6B6B] hover:underline">
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}