import { RegisterForm } from "@/types/auth";
// API for auth routes

// Register user function
export async function registerUser(formData: RegisterForm) {
    const { confirmPassword, ...apiData } = formData
    const apiURL = process.env.NEXT_PUBLIC_API_URL

    const res = await fetch(`${apiURL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData)
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration Failed")
    }

    return await res.json()
}