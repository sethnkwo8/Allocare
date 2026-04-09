// Error skeleton component

import { Button } from "../ui/button";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import { ErrorSkeletonProps } from "@/types/error";
import Link from "next/link";

export function ErrorSkeleton({ message, retry }: ErrorSkeletonProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-100 w-full p-8 text-center animate-in fade-in duration-500">
            <div className="bg-red-50 p-4 rounded-full mb-6">
                <AlertCircle className="h-10 w-10 text-red-500" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Something went wrong
            </h2>

            <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
                {message || "We couldn't load your financial data. This might be a temporary connection issue."}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
                {retry && (
                    <Button
                        onClick={retry}
                        className="bg-[#2E6B6B] hover:bg-[#245858] text-white flex items-center gap-2"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Try Again
                    </Button>
                )}

                <Link href="/dashboard">
                    <Button variant="outline" className="border-gray-200 text-gray-600 flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Back to Safety
                    </Button>
                </Link>
            </div>
        </div>
    );
}