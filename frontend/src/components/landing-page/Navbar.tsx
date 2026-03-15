// Navbar
import Link from "next/link";
import Image from "next/image";
import { ScrollLink } from "./ScrollLink";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-gray-200/60">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center">
                    <Link href='/'>
                        <Image
                            src="/navbar-logo.png"
                            alt="Allocare Logo"
                            width={262}
                            height={109}
                            priority // logo loads instantly
                            className="h-10 md:h-12 w-auto object-contain"
                        />
                    </Link>
                </div>
                <nav className="hidden md:flex items-center gap-8 text-sm text-gray-500">
                    <ScrollLink href="#features" className="hover:text-gray-900 transition-colors">Features</ScrollLink>
                    <ScrollLink href="#how-it-works" className="hover:text-gray-900 transition-colors">How it works</ScrollLink>
                    <ScrollLink href="#faq" className="hover:text-gray-900 transition-colors">FAQ</ScrollLink>
                </nav>
                <div className="flex items-center gap-3">
                    <Link
                        href="/login"
                        className="hidden sm:block text-sm text-gray-500 hover:text-gray-900 transition-colors px-3 py-2"
                    >
                        Log in
                    </Link>
                    <Link
                        href="/register"
                        className="text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium bg-[#2E6B6B] hover:bg-[#245858]"
                    >
                        Get started free
                    </Link>
                </div>
            </div>
        </header>
    )
}