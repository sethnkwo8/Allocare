// How It Works Section
import { StepsDescription } from "./StepsDescription"
import { StepsNumberCard } from "./StepsNumbersCard"
import { steps } from "@/lib/landing-page/steps"
import Image from "next/image"

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 px-6 bg-white border-y border-gray-100">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <div className="text-xs uppercase tracking-wider mb-3" style={{ fontWeight: 600, color: "#2E6B6B" }}>How it works</div>
                    <h2 className="text-4xl text-gray-900 mb-4 tracking-tight" style={{ fontWeight: 800 }}>From payday to peace of mind in three steps</h2>
                    <p className="text-gray-500 mb-10">Most people react to their spending. Allocare makes you proactive. Here's how simple it is.</p>
                    <div className="space-y-8">
                        {steps.map((s, i) => (
                            <div key={s.num} className="flex gap-5">
                                <StepsNumberCard num={s.num} />
                                <div>
                                    <StepsDescription title={s.title} desc={s.desc} />
                                    {i < steps.length - 1 && <div className="w-px h-6 bg-gray-200 -ml-6.25 mt-4 hidden sm:block" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200/60">
                    <Image
                        src="https://images.unsplash.com/photo-1766503634881-6a01d341b1dd?..."
                        alt="Budgeting on laptop"
                        width={1080}
                        height={420}
                        className="w-full max-h-105 object-cover object-center rounded-2xl shadow-lg"
                    />
                </div>
            </div>
        </section>
    )
}