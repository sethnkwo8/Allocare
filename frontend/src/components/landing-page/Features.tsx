import { Features } from "@/lib/features"
import { FeaturesCard } from "./FeaturesCard"

export function FeaturesSection() {
    return (
        <section id="features" className="px-6">
            <div className="max-w-6xl mx-auto">
                <div className="max-w-xl mb-16">
                    <div className="text-xs uppercase tracking-wider mb-3" style={{ fontWeight: 600, color: "#2E6B6B" }}>Features</div>
                    <h2 className="text-4xl text-gray-900 mb-4 tracking-tight" style={{ fontWeight: 800 }}>Built around how money actually works</h2>
                    <p className="text-gray-500">Not another expense tracker. Allocare is a proactive budgeting system designed to put you in control — before you spend.</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Features.map(f => (
                        <FeaturesCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
                    ))}
                </div>
            </div>
        </section>
    )
}