export interface FeaturesCardProps {
    icon: React.ReactNode;
    title: string;
    desc: string;
}

export type FeaturesData = FeaturesCardProps[]

export interface StepsNumberCardProps {
    num: string;
}

export interface StepsDescriptionProps {
    title: string;
    desc: string;
}

export interface Steps {
    num: string;
    title: string;
    desc: string;
}

export type StepsData = Steps[]