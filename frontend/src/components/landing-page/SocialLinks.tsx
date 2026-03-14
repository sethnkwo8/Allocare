import { Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

export function SocialLinks() {
    return (
        <div className="flex gap-4">
            <Link href="https://github.com/sethnkwo8"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#2E6B6B] text-gray-500 transition-colors">
                <Github size={20} />
            </Link>
            <Link href="https://www.linkedin.com/in/seth-nkwo/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#2E6B6B] text-gray-500 transition-colors">
                <Linkedin size={20} />
            </Link>
            <Link href="mailto:sethnkwo@yahoo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#2E6B6B] text-gray-500 transition-colors">
                <Mail size={20} />
            </Link>
        </div>
    );
};