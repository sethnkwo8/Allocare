import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { frequencies } from "@/lib/onboarding/frequencies";
import { IncomeFrequencyStepProps } from "@/types/onboarding";

export function IncomeFrequencyStep({
    income,
    frequency,
    onIncomeChange,
    onFrequencyChange,
    currencySymbol,
}: IncomeFrequencyStepProps) {
    return (
        <div className="space-y-8 w-full max-w-md mx-auto">
            <div className="space-y-2 text-center">
                <h2 className="text-3xl">Your Income</h2>
                <p className="text-muted-foreground">
                    Enter your income amount and how often you receive it
                </p>
            </div>

            {/* Income Amount */}
            <div className="space-y-3">
                <Label htmlFor="income">Income Amount</Label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                        {currencySymbol}
                    </span>
                    <Input
                        id="income"
                        type="number"
                        value={income}
                        onChange={(e) => onIncomeChange(e.target.value)}
                        placeholder="0.00"
                        className="h-12 pl-10 text-lg"
                        min="0"
                        step="0.01"
                    />
                </div>
            </div>

            {/* Frequency */}
            <div className="space-y-3">
                <Label>Payment Frequency</Label>
                <RadioGroup value={frequency} onValueChange={onFrequencyChange} className="space-y-2">
                    {frequencies.map((freq) => {
                        const Icon = freq.icon;
                        return (
                            <label
                                key={freq.value}
                                className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-accent ${frequency === freq.value
                                        ? "border-primary bg-accent"
                                        : "border-border"
                                    }`}
                            >
                                <RadioGroupItem value={freq.value} id={freq.value} />
                                <Icon className="h-5 w-5 text-muted-foreground" />
                                <div className="flex-1">
                                    <div className="font-medium">{freq.label}</div>
                                    <div className="text-sm text-muted-foreground">{freq.description}</div>
                                </div>
                            </label>
                        );
                    })}
                </RadioGroup>
            </div>
        </div>
    );
}