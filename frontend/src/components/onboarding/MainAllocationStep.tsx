// Main allocation buckets setup
import { MainAllocationProps } from "@/types/onboarding";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { categories } from "@/lib/onboarding/buckets";

export function MainAllocationStep({
    allocations,
    onChange,
    currencySymbol,
    income }: MainAllocationProps) {

    // Calculate total percentage
    const totalPercentage = allocations.needs + allocations.wants + allocations.savings;

    // Convert income to float for calculations
    const incomeValue = parseFloat(income) || 0;

    // Function for slider
    const handleSliderChange = (categoryId: keyof typeof allocations, value: number[]) => {
        onChange({
            ...allocations,
            [categoryId]: value[0],
        });
    };

    return (
        <div className="space-y-6 w-full">
            <div className="space-y-2 text-center">
                <h2 className="text-3xl">Budget Allocation</h2>
                <p className="text-muted-foreground">
                    How would you like to split your income?
                </p>
                <p className="text-sm text-muted-foreground">
                    Common rule: 50% needs, 30% wants, 20% savings
                </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
                    <span className="font-medium">Total Allocated</span>
                    <span className={`font-medium ${totalPercentage !== 100 ? "text-destructive" : "text-primary"}`}>
                        {totalPercentage}%
                    </span>
                </div>

                <div className="space-y-6">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        const percentage = allocations[category.id];
                        const amount = (incomeValue * percentage) / 100;

                        return (
                            <div key={category.id} className={`space-y-3 p-4 rounded-lg ${category.bgColor}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg bg-white`}>
                                            <Icon className={`h-6 w-6 ${category.color}`} />
                                        </div>
                                        <div>
                                            <Label className="text-base">{category.label}</Label>
                                            <p className="text-xs text-muted-foreground">{category.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-2">
                                        <div className="font-medium text-lg leading-none">{percentage}%</div>
                                        <div className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap mt-1">
                                            {currencySymbol}{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                </div>
                                <Slider
                                    value={[percentage]}
                                    onValueChange={(value) => handleSliderChange(category.id, value)}
                                    max={100}
                                    step={5}
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