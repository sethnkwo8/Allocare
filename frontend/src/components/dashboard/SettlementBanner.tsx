import { AlertCircle, ArrowRight } from "lucide-react"
import { Button } from "../ui/button"

export function SettlementBanner({ balance, onSettle, currencySymbol }: {
    balance: number,
    onSettle: () => void,
    currencySymbol: string
}) {
    return (
        <div className="mb-6 bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                    <AlertCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <p className="font-medium text-sm">Unallocated Surplus Detected</p>
                    <p className="text-xs text-muted-foreground">
                        You have <span className="font-bold text-foreground">{currencySymbol}{balance.toLocaleString()}</span> remaining from your monthly budget.
                    </p>
                </div>
            </div>
            <Button size="sm" onClick={onSettle} className="gap-2">
                Settle Now
                <ArrowRight className="h-4 w-4" />
            </Button>
        </div>
    )
}