'use client'
// Hero Section

import Link from "next/link"

export function HeroSection() {
    return (
        <section className="pt-20 pb-28 px-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-100 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: "rgba(46,107,107,0.08)" }} />
            <div className="absolute top-20 right-0 w-75 h-75 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: "rgba(46,107,107,0.05)" }} />

            <div className="relative max-w-3xl mx-auto">
                <h1 className="text-4xl sm:text-5xl md:text-[3.75rem] text-gray-900 mb-6 tracking-tight" style={{ fontWeight: 800, lineHeight: 1.1 }}>
                    Budget by allocation,<br />
                    <span style={{ color: "#2E6B6B" }}>not by regret.</span>
                </h1>
                <p className="text-gray-500 mb-10 max-w-xl mx-auto" style={{ fontSize: "1.125rem", lineHeight: 1.7 }}>
                    Allocare helps you give every pound or dollar a purpose before you spend it — so you always know what's available, and nothing comes as a surprise.
                </p>
                <div className="flex flex-col items-center gap-5">
                    <Link
                        href="/register"
                        className="text-white px-10 py-4 rounded-full text-base transition-all transform hover:scale-105 shadow-md font-bold bg-[#2E6B6B] hover:bg-[#245858]"
                    >
                        Start for free — in 2 minutes
                    </Link>
                    <p className="text-xs text-gray-400">
                        Free forever · No credit card required · Setup is instant
                    </p>
                </div>
            </div>
        </section>
    )
}