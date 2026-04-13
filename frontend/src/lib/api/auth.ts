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

// Logout user function
export async function logoutUser() {
    const apiURL = process.env.NEXT_PUBLIC_API_URL

    const res = await fetch(`${apiURL}/auth/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    })

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Logout Failed")
    }

    return await res.json()
}

// Forgot password function
export async function forgotPassword(email: string) {
    const apiURL = process.env.NEXT_PUBLIC_API_URL

    const res = await fetch(`${apiURL}/auth/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email })
    })

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Forgot Password Failed")
    }

    return await res.json()
}

// Reset password function
export async function resetPassword(token: string, password: string) {
    const apiURL = process.env.NEXT_PUBLIC_API_URL

    const res = await fetch(`${apiURL}/auth/reset-password-confirm`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            token,
            new_password: password
        })
    })

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to reset password");
    }

    return await res.json()
}