// Features Section
import { Features } from "@/lib/landing-page/constants"
import { FeaturesCardProps } from "@/types/landing-page";

export function FeaturesSection() {
    return (
        <section id="features" className="pb-12 px-6">
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

// Features Card
export function FeaturesCard({ icon, title, desc }: FeaturesCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200/70 p-6 hover:shadow-md transition-all group hover:border-[#a8d0d0]" style={{ borderColor: undefined }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors" style={{ backgroundColor: "#f0f8f8", color: "#2E6B6B" }}>
                {icon}
            </div>
            <h3 className="text-gray-900 mb-2 font-semibold">{title}</h3>
            <p className="text-sm text-gray-500" style={{ lineHeight: 1.65 }}>{desc}</p>
        </div>
    )
}