import Link from "next/link";
import Image from "next/image";

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
                    <Link className="hover:text-gray-900 transition-colors" href='#features'>Features</Link>
                    <Link className="hover:text-gray-900 transition-colors" href='/'>How it works</Link>
                    <Link className="hover:text-gray-900 transition-colors" href='/'>FAQ</Link>
                </nav>
                <div className="flex items-center gap-3">
                    <button className="hidden sm:block text-sm text-gray-500 hover:text-gray-900 transition-colors px-3 py-2">Log in</button>
                    <button
                        className="text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium bg-[#2E6B6B] hover:bg-[#245858]">
                        Get started free
                    </button>
                </div>
            </div>
        </header>
    )
}