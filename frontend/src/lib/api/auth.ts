import { RegisterFormType, LoginFormType } from "@/types/auth";
// API for auth routes

// Register user function
export async function registerUser(formData: RegisterFormType) {
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

// Login user function
export async function loginUser(formData: LoginFormType) {
    const apiURL = process.env.NEXT_PUBLIC_API_URL

    const res = await fetch(`${apiURL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData)
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login Failed")
    }

    return await res.json()
}