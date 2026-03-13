'use client'

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
                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto mb-5">
                    <input
                        type="email"
                        placeholder="Your email address"
                        // value={}
                        // onChange={e => setEmail(e.target.value)}
                        className="flex-1 border border-gray-200 bg-white rounded-lg px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2E6B6B]/40"
                        style={{ outline: "none" }}

                    />
                    <button
                        // onClick={() => setShowOnboarding(true)}
                        className="text-white px-6 py-3 rounded-lg text-sm transition-colors whitespace-nowrap shadow-sm font-semibold bg-[#2E6B6B] hover:bg-[#245858]"
                    >
                        Start for free →
                    </button>
                </div>
                <p className="text-xs text-gray-400">Free forever · No credit card needed · Setup in 2 minutes</p>
            </div>
        </section>
    )
}