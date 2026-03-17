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
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
    // State for password show
    const [showPassword, setShowPassword] = useState<boolean>(false)

    // State for confirm password show
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

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
            // Redirect to login
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

    // Password requirements
    const requirements = [
        { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
        { label: "At least one number", test: (pw: string) => /\d/.test(pw) },
        { label: "At least one symbol (@, $, !, etc.)", test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
    ];

    // Check if password is valid
    const isPasswordValid = requirements.every(req => req.test(formData.password));

    // Check if form is valid
    const isFormValid =
        formData.name.trim() !== "" &&
        formData.email.includes("@") &&
        isPasswordValid &&
        formData.confirmPassword === formData.password;

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
                                    className={cn(
                                        "transition-colors",
                                        formData.email.length > 0 && !formData.email.includes("@") && "border-red-500 focus-visible:ring-red-500"
                                    )}
                                    placeholder="you@example.com"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                {formData.email.length > 0 && !formData.email.includes("@") && (
                                    <p className="text-xs text-red-500">Enter a valid email address</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        className={cn(
                                            "pr-10",
                                            formData.password && !isPasswordValid && "border-red-500 focus-visible:ring-red-500"
                                        )}
                                        placeholder="••••••••"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
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
                                {/* Password Checklist */}
                                <div className="pt-2 space-y-1">
                                    {requirements.map((req, index) => {
                                        const isMet = req.test(formData.password);
                                        return (
                                            <p key={index} className={`text-xs flex items-center gap-2 ${isMet ? "text-green-600" : "text-muted-foreground"}`}>
                                                {isMet ? "✓" : "○"} {req.label}
                                            </p>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        className={cn(
                                            "pr-10",
                                            formData.confirmPassword && formData.confirmPassword !== formData.password && "border-red-500 outline-0 focus-visible:ring-red-500")}
                                        placeholder="••••••••"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                                    <p className="text-xs text-red-500">Password don't match.</p>
                                )}
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