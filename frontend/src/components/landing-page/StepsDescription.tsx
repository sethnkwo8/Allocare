import { StepsDescriptionProps } from "@/types/landing-page";

export function StepsDescription({ title, desc }: StepsDescriptionProps) {
    return (
        <>
            <div className="text-gray-900 mb-1" style={{ fontWeight: 600 }}>{title}</div>
            <p className="text-sm text-gray-500" style={{ lineHeight: 1.65 }}>{desc}</p>
        </>
    )
}