// Social Links
import { Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

export function SocialLinks() {
    return (
        <div className="flex gap-4">
            <Link href="https://github.com/sethnkwo8"
                aria-label='GitHub profile'
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#2E6B6B] text-gray-500 transition-colors">
                <Github size={20} />
            </Link>
            <Link href="https://www.linkedin.com/in/seth-nkwo/"
                aria-label='LinkedIn profile'
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#2E6B6B] text-gray-500 transition-colors">
                <Linkedin size={20} />
            </Link>
            <Link href="mailto:sethnkwo@yahoo.com"
                aria-label='Email'
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#2E6B6B] text-gray-500 transition-colors">
                <Mail size={20} />
            </Link>
        </div>
    );
};