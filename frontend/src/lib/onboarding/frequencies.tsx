import { Calendar, CalendarDays, CalendarRange } from "lucide-react";

// Income frequencies
export const frequencies = [
    { value: "weekly", label: "Weekly", icon: Calendar, description: "Every week" },
    { value: "biweekly", label: "Bi-weekly", icon: CalendarDays, description: "Every 2 weeks" },
    { value: "monthly", label: "Monthly", icon: CalendarRange, description: "Every month" },
    { value: "yearly", label: "Yearly", icon: CalendarRange, description: "Every year" },
];