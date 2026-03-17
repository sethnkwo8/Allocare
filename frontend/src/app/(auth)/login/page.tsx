// Login Page
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { LoginForm } from "@/types/auth";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api/auth";

export default function LoginPage() {

    const router = useRouter();

    // Form data
    const [formData, setFormData] = useState<LoginForm>({
        email: "",
        password: ""
    });

    // Show password state
    const [showPassword, setShowPassword] = useState<boolean>(false);

    // Error State
    const [errorMessage, setErrorMessage] = useState<string>("")

    // Loading state
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // Change function for input
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        // Clear error while typing
        setErrorMessage("")

        // Set form data
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    // Function for form submit
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        // Cleaned data
        const cleanedData = {
            ...formData,
            email: formData.email.trim()
        }

        setIsLoading(true);

        try {
            // API logic
            const data = await loginUser(cleanedData)

            console.log("Login successful")

            // Redirect logic
            if (!data.onboarding) {
                router.push('/onboarding')
            } else {
                router.push('/dashboard')
            }

        }
        catch (error: any) {
            // Catch error
            setErrorMessage(error.message || "An error occured")
        }
        finally {
            // Set isLoading to false
            setIsLoading(false)
        }
    }

    // Password requirements
    const requirements = [
        { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
        { label: "At least one number", test: (pw: string) => /\d/.test(pw) },
        { label: "At least one symbol (@, $, !, etc.)", test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
    ];



    // Check if form is valid
    const isFormValid =
        formData.email.includes("@") &&
        formData.password.length >= 8

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#2E6B6B]/10 to-background p-4">
            <div className="w-full max-w-md space-y-6">
                <Link href="/" className="block">
                    <h1 className="text-4xl font-bold text-center text-[#2E6B6B] hover:opacity-80 transition-opacity">
                        Allocare
                    </h1>
                </Link>

                <Card className="w-full">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-center">Welcome Back</CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    onChange={handleChange}
                                    type="email"
                                    value={formData.email}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        onChange={handleChange}
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        className="pr-10"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            {errorMessage && <p className="text-red-500 text-base">{errorMessage}</p>}
                            <Button disabled={isLoading || !isFormValid} type="submit" className="w-full">
                                {isLoading ? "Logging in..." : "Sign In"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-primary hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}