// Interface for Features Card Props
export interface FeaturesCardProps {
    icon: React.ReactNode;
    title: string;
    desc: string;
}
// Type for Features Data
export type FeaturesData = FeaturesCardProps[]

// Interface for Steps Number Card Props
export interface StepsNumberCardProps {
    num: string;
}

// Interface for Steps Description Props
export interface StepsDescriptionProps {
    title: string;
    desc: string;
}

// Interface for Steps
export interface Steps {
    num: string;
    title: string;
    desc: string;
}

// Type for Steps Data
export type StepsData = Steps[]

// Interface for ScrollLink
export interface ScrollLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}