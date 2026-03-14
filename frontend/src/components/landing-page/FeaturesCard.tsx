import { FeaturesCardProps } from "@/lib/types";

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