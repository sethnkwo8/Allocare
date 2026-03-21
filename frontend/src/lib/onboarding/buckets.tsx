import { Wallet, ShoppingBag, PiggyBank } from "lucide-react";

export const categories = [
    {
        id: "needs" as const,
        label: "Needs",
        icon: Wallet,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        description: "Essential expenses like housing, groceries, utilities, tithe",
    },
    {
        id: "wants" as const,
        label: "Wants",
        icon: ShoppingBag,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        description: "Non-essential spending like entertainment, dining out",
    },
    {
        id: "savings" as const,
        label: "Savings",
        icon: PiggyBank,
        color: "text-green-600",
        bgColor: "bg-green-50",
        description: "Emergency fund, retirement, investments",
    },
];