// CTA Banner
export function CTABanner() {
    return (
        <section className="py-24 px-6" style={{ backgroundColor: "#2E6B6B" }}>
            <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-4xl text-white mb-4 tracking-tight" style={{ fontWeight: 800 }}>Ready to allocate with intention?</h2>
                <p className="mb-10" style={{ color: "rgba(255,255,255,0.7)" }}>Take control of your money with Allocare. It's free to start.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                    <input
                        type="email"
                        placeholder="Your email address"
                        className="flex-1 rounded-lg px-4 py-3 text-sm text-white focus:outline-none"
                        style={{ backgroundColor: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}
                    />
                    <button
                        className="bg-white px-6 py-3 rounded-lg text-sm whitespace-nowrap transition-colors hover:bg-[#f0f8f8]" style={{ fontWeight: 600, color: "#2E6B6B" }}>
                        Get started free →
                    </button>
                </div>
                <p className="text-xs mt-4" style={{ color: "rgba(255,255,255,0.5)" }}>No credit card needed</p>
            </div>
        </section>
    )
}