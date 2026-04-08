// CTA Banner
import Link from "next/link"

export function CTABanner() {
    return (
        <section className="py-24 px-6" style={{ backgroundColor: "#2E6B6B" }}>
            <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-4xl text-white mb-4 tracking-tight" style={{ fontWeight: 800 }}>Ready to allocate with intention?</h2>
                <p className="mb-10" style={{ color: "rgba(255,255,255,0.7)" }}>Take control of your money with Allocare. It's free to start.</p>
                <div className="flex flex-col items-center gap-5">
                    <Link
                        href="/register"
                        className="bg-white px-10 py-4 rounded-full text-base transition-all transform hover:scale-105 shadow-xl inline-block"
                        style={{ fontWeight: 700, color: "#2E6B6B" }}
                    >
                        Get started free — setup in minutes
                    </Link>

                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                        No credit card needed · Instant access
                    </p>
                </div>
            </div>
        </section>
    )
}