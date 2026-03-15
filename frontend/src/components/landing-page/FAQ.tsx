// FAQ section
import { faqs } from "@/lib/landing-page/faq"
import { Accordion } from "../ui/accordion"
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { FAQ } from "@/types/landing-page"

export function FAQSection() {
    return (
        <section id="faq" className="py-24 px-6 bg-[#FAFAFA] border-t border-gray-100">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <div className="text-xs uppercase tracking-wider mb-3 font-semibold text-[#2E6B6B]">
                        FAQ
                    </div>
                    <h2 className="text-4xl text-gray-900 tracking-tight font-extrabold">
                        Common questions
                    </h2>
                </div>

                <Accordion
                    type="single"
                    collapsible
                >
                    {faqs.map((f) => (
                        <AccordionBasic key={f.value} value={f.value} q={f.q} a={f.a} />
                    ))}
                </Accordion>
            </div>
        </section>
    )
}

// Accordion Item
export function AccordionBasic({ value, q, a }: FAQ) {
    return (
        <AccordionItem key={value} value={value}>
            <AccordionTrigger>{q}</AccordionTrigger>
            <AccordionContent>{a}</AccordionContent>
        </AccordionItem>
    )
}