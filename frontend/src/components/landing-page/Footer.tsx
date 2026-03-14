// Footer
import Image from "next/image"
import { SocialLinks } from "./SocialLinks"
import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-gray-950 px-6 py-14">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">
                    <div className="max-w-xs">
                        <div className="flex items-center gap-2.5 mb-4">
                            <Image
                                src="/footer-logo-2.png"
                                alt="Allocare Icon"
                                width={40}
                                height={40}
                                className="w-10 h-10 object-contain"
                            />
                        </div>
                        <p className="text-gray-500 text-sm" style={{ lineHeight: 1.65 }}>Proactive budgeting for people who want to spend with intention and save with purpose.</p>
                    </div>
                    <div className="flex flex-wrap gap-12 text-sm">
                        {[
                            { title: "Product", links: ["Features", "How it works", "FAQ"] },
                            { title: "Support", links: ["Help centre", "Community", "Contact us", "Privacy", "Terms"] },
                        ].map(col => (
                            <div key={col.title}>
                                <div className="text-gray-400 text-xs uppercase tracking-wider mb-4" style={{ fontWeight: 600 }}>{col.title}</div>
                                <ul className="space-y-2.5">
                                    {col.links.map(l => (
                                        <li key={l}><Link href="#" className="text-gray-400 hover:text-gray-300 transition-colors text-sm">{l}</Link></li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-600">
                    <span>© 2026 Allocare Ltd. All rights reserved.</span>
                    <div className="flex gap-4">
                        <SocialLinks />
                    </div>
                </div>
            </div>
        </footer>
    )
}