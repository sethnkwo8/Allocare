import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { FAQ } from "@/types/landing-page"

export function AccordionBasic({ value, q, a }: FAQ) {
    return (
        <AccordionItem key={value} value={value}>
            <AccordionTrigger>{q}</AccordionTrigger>
            <AccordionContent>{a}</AccordionContent>
        </AccordionItem>
    )
}