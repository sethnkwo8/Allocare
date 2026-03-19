"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const apiURL = process.env.NEXT_PUBLIC_API_URL

    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

    useEffect(() => {
        async function checkUser() {
            try {
                const res = await fetch(`${apiURL}/auth/me`, {
                    credentials: "include"
                });

                // If not authorized redirect to login
                if (!res.ok) {
                    router.push('/login');
                    return;
                }

                const user = await res.json();

                // Redirect if onboarding isn't complete
                if (!user.onboarding && pathname !== "/onboarding") {
                    router.push("/onboarding")
                    return;
                }

                // Redirect to dashboard if onboarding is complete
                if (user.onboarding && pathname === "/onboarding") {
                    router.push("/dashboard")
                    return
                }

                // Set authorized state to true if checks are completed
                setIsAuthorized(true)

            } catch {
                router.push("/login")
            }
        }

        checkUser()
    }, [router, pathname]);

    // Returns loading.tsx
    if (!isAuthorized) return null;

    return <>{children}</>
}