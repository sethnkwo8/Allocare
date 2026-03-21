import {
    Home, Church, ShoppingCart, Zap, Car, Heart, MoreHorizontal,
    Tv, Coffee, ShoppingBag, Plane, Dumbbell
} from "lucide-react";

// Default categories for needs
export const needsCategories = [
    { id: "housing", label: "Housing", icon: Home, description: "Rent, mortgage, property tax" },
    { id: "groceries", label: "Groceries", icon: ShoppingCart, description: "Food and household items" },
    { id: "utilities", label: "Utilities", icon: Zap, description: "Electricity, water, internet" },
    { id: "transportation", label: "Transportation", icon: Car, description: "Car payment, gas, transit" },
    { id: "healthcare", label: "Healthcare", icon: Heart, description: "Insurance, medications" },
    { id: "tithe", label: "Tithe", icon: Church, description: "Church tithe" },
    { id: "otherNeeds", label: "Other Needs", icon: MoreHorizontal, description: "Other essentials" },
];

// Default categories for wants
export const wantsCategories = [
    { id: "entertainment", label: "Entertainment", icon: Tv, description: "Streaming, movies, games" },
    { id: "diningOut", label: "Dining Out", icon: Coffee, description: "Restaurants, cafes" },
    { id: "shopping", label: "Shopping", icon: ShoppingBag, description: "Clothes, gadgets, hobbies" },
    { id: "travel", label: "Travel", icon: Plane, description: "Vacations, weekend trips" },
    { id: "fitness", label: "Fitness", icon: Dumbbell, description: "Gym, sports, wellness" },
    { id: "otherWants", label: "Other Wants", icon: MoreHorizontal, description: "Other discretionary" },
];

// Default categories for savings