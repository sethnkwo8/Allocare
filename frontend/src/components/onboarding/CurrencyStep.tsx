import { Label } from "../ui/label";
import { CurrencyStepProps } from "@/types/onboarding";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../ui/select"
import { currencies } from "@/lib/onboarding/currency";

export function CurrencyStep({ value, onChange }: CurrencyStepProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h2 className="text-3xl">Select Your Currency</h2>
                <p className="text-muted-foreground">
                    Choose the currency you'll be using for your budget
                </p>
            </div>

            <div className="space-y-3 max-w-md mx-auto">
                <Label htmlFor="currency">Currency</Label>
                <Select value={value} onValueChange={onChange}>
                    <SelectTrigger id="currency" className="h-12">
                        <SelectValue placeholder="Select a currency" />
                    </SelectTrigger>
                    <SelectContent>
                        {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">{currency.symbol}</span>
                                    <span>{currency.name}</span>
                                    <span className="text-muted-foreground">({currency.code})</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}