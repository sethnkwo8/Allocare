// Steps Numbers Card
import { StepsNumberCardProps } from "@/types/landing-page";

export function StepsNumberCard({ num }: StepsNumberCardProps) {
    return (
        <div className="shrink-0 w-10 h-10 rounded-xl text-white flex items-center justify-center text-xs" style={{ fontWeight: 700, backgroundColor: "#2E6B6B" }}>{num}</div>
    )
}