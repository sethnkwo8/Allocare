// Reusable component for bucket categories breakdown

import { CategoryBreakdownStepProps } from "@/types/onboarding";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";

export function CategoryBreakdownStep({
    title,
    categories,
    breakdown,
    onChange,
    currencySymbol,
    categoryAmount,
    colorClass
}: CategoryBreakdownStepProps) {
    // Calculate total percentage of categories
    const totalPercentage = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

    // Function for slider change
    const handleSliderChange = (categoryId: string, value: number[]) => {
        onChange({
            ...breakdown,
            [categoryId]: value[0],
        });
    };


    return (
        <div className="space-y-6 w-full">
            <div className="space-y-2 text-center">
                <h2 className="text-3xl">{title}</h2>
                <p className="text-muted-foreground">
                    Allocate your needs budget: {currencySymbol}{categoryAmount.toFixed(2)}
                </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border-2 border-border">
                    <span className="font-medium text-sm sm:text-base">Total Allocated</span>
                    <span className={`font-bold text-lg ${totalPercentage !== 100 ? "text-destructive" : "text-primary"}`}>
                        {totalPercentage}%
                    </span>
                </div>

                <div className="space-y-4">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        const percentage = breakdown[category.id] || 0;
                        const amount = (categoryAmount * percentage) / 100;

                        return (
                            <div key={category.id} className="space-y-2">
                                <div className="flex items-center justify-between min-w-0 gap-2">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <Icon className={`h-5 w-5 shrink-0 ${colorClass}`} />
                                        <div className="truncate">
                                            <Label className="text-sm truncate">{category.label}</Label>
                                            <p className="text-[10px] text-muted-foreground truncate leading-tight">
                                                {category.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="font-bold text-sm">{percentage}%</div>
                                        <div className="text-[11px] text-muted-foreground whitespace-nowrap">
                                            {currencySymbol}{amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </div>
                                    </div>
                                </div>
                                <Slider
                                    value={[percentage]}
                                    onValueChange={(value) => handleSliderChange(category.id, value)}
                                    max={100}
                                    step={1}
                                    className="w-full"
                                />
                            </div>
                        );
                    })}
                </div>

                {totalPercentage !== 100 && (
                    <div className="text-sm text-destructive text-center p-3 bg-destructive/10 rounded-lg">
                        Total allocation must equate to 100%. Please adjust your percentages.
                    </div>
                )}
            </div>
        </div>
    );
}