// Register Page
"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterForm } from "@/types/auth";
import { registerUser } from "@/lib/api/auth";

export default function RegisterPage() {
    // Router for redirect
    const router = useRouter()

    // Data for form
    const [formData, setFormData] = useState<RegisterForm>({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    // Error data
    const [errorMessage, setErrorMessage] = useState<string>("")

    // Loading state
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // Function to store input changes
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        // Clear error while typing
        if (errorMessage) {
            setErrorMessage("")
        }

        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value // matches input name
        }))
    }

    // Function for form submit
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        // Cleaned data
        const cleanedData = {
            ...formData,
            name: formData.name.trim(),
            email: formData.email.trim()
        }


        // If passwords don't match exit function
        if (cleanedData.password !== cleanedData.confirmPassword) {
            setErrorMessage("Passwords don't match")
            return
        }

        // Set Loading State
        setIsLoading(true)

        // Clear error state
        setErrorMessage("")

        // API Logic
        try {
            await registerUser(cleanedData)
            console.log("User registered successfully!")
            router.push('/login')
        }
        catch (error: any) {
            // Catch Error
            setErrorMessage(error.message || "Unexpected error occured")
        } finally {
            // Set loading state back to false
            setIsLoading(false)
        }
    }

    // Check if form is valid
    const isFormValid =
        formData.name.trim() !== "" &&
        formData.email.includes("@") &&
        formData.password.length >= 8 &&
        formData.confirmPassword !== "";

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
                        <CardTitle className="text-center">Create an Account</CardTitle>
                        <CardDescription className="text-center">
                            Enter your information to get started
                        </CardDescription>
                    </CardHeader>
                    {/* Form */}
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    className={!formData.email.includes("@") ? "border-red-500 outline-0" : ""}
                                    placeholder="you@example.com"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                {!formData.email.includes("@") && (
                                    <p className="text-xs text-red-500">Enter a valid email address</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    className={formData.password.length > 0 && formData.password.length < 8 ? "border-red-500 outline-0" : ""}
                                    placeholder="••••••••"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                {formData.password.length > 0 && formData.password.length < 8 && (
                                    <p className="text-xs text-red-500">Password must be at least 8 characters.</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    className={formData.confirmPassword && formData.confirmPassword !== formData.password ? "border-red-500 outline-0" : ""}
                                    placeholder="••••••••"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {errorMessage && <p className="text-red-500 text-base">{errorMessage}</p>}
                            <Button disabled={isLoading || !isFormValid} type="submit" className="w-full">
                                {isLoading ? "Creating account..." : "Sign Up"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}