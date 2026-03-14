// Link for navbar items to remove id from URL
"use client";

import React from "react";
import { ScrollLinkProps } from "@/types/landing-page";

export const ScrollLink = ({ href, children, className }: ScrollLinkProps) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        // Extract the ID from the href
        const targetId = href.replace("#", "");
        const elem = document.getElementById(targetId);

        if (elem) {
            elem.scrollIntoView({ behavior: "smooth" });

            // Cleans the URL without a page reload or adding the hash
            window.history.pushState({}, "", "/");
        }
    };

    return (
        <a href={href} onClick={handleClick} className={className}>
            {children}
        </a>
    );
};