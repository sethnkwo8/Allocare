// Settlement Modal
import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatWithCommas, getCurrencySymbol } from "@/lib/dashboard/utils"
import { TrendingUp, Target } from "lucide-react"
import { SettlementModalProps } from "@/types/dashboard"
import { toast } from "sonner"

export function SettlementModal({ isOpen, onClose, balance, currencyCode, goals, onConfirm, refresh }: SettlementModalProps) {
    const [action, setAction] = useState<"rollover" | "goal">("rollover")
    const [selectedGoal, setSelectedGoal] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const symbol = getCurrencySymbol(currencyCode)

    const handleSettlement = async () => {
        setLoading(true)
        try {
            await onConfirm(action, balance, action === "goal" ? selectedGoal : undefined)
            // Success toast
            const selectedGoalName = action === "goal" ? goals.find(g => g.id === selectedGoal)?.name : undefined;
            const successMessage = action === "goal"
                ? `Settled to ${selectedGoalName}`
                : `Balance moved to ${action}`;

            toast.success("Settlement Complete", {
                description: `${successMessage} — ${symbol}${balance.toLocaleString()}`,
            });

            onClose()
            refresh()
        } catch (error) {
            console.error("Settlement failed", error)
            toast.error("Settlement Failed", {
                description: "We couldn't process this transaction. Please try again."
            });
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-width-[425px]">
                <DialogHeader>
                    <DialogTitle>Close out the Month</DialogTitle>
                    <DialogDescription>
                        You have <span className="font-bold text-foreground">{symbol}{formatWithCommas(balance.toFixed(2))}</span> remaining. How should we allocate it?
                    </DialogDescription>
                </DialogHeader>

                <RadioGroup value={action} onValueChange={(v) => setAction(v as any)} className="grid gap-4 py-4">
                    <div className="flex items-center space-x-4 rounded-lg border p-4 cursor-pointer hover:bg-accent transition-colors">
                        <RadioGroupItem value="rollover" id="rollover" />
                        <Label htmlFor="rollover" className="flex flex-1 items-center gap-3 cursor-pointer">
                            <TrendingUp className="h-5 w-5 text-emerald-600" />
                            <div>
                                <p className="font-medium">Rollover to Next Month</p>
                                <p className="text-xs text-muted-foreground">Boosts your spending power for next month.</p>
                            </div>
                        </Label>
                    </div>

                    <div className="flex items-center space-x-4 rounded-lg border p-4 cursor-pointer hover:bg-accent transition-colors">
                        <RadioGroupItem value="goal" id="goal" />
                        <Label htmlFor="goal" className="flex flex-1 items-center gap-3 cursor-pointer">
                            <Target className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="font-medium">Sweep to Goal</p>
                                <p className="text-xs text-muted-foreground">Put this surplus directly into one of your goals.</p>
                            </div>
                        </Label>
                    </div>
                </RadioGroup>

                {action === "goal" && (
                    <div className="space-y-2 pb-4 animate-in fade-in slide-in-from-top-2">
                        <Label>Select Goal</Label>
                        <Select value={selectedGoal} onValueChange={setSelectedGoal}>
                            <SelectTrigger>
                                <SelectValue placeholder="Which goal are we funding?" />
                            </SelectTrigger>
                            <SelectContent>
                                {goals.map((goal) => (
                                    <SelectItem key={goal.id} value={goal.id}>
                                        {goal.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <Button
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => {
                            onClose();
                        }}
                    >
                        I'll do this later
                    </Button>
                    <Button
                        className="w-full sm:w-auto px-8"
                        disabled={loading || (action === "goal" && !selectedGoal)}
                        onClick={handleSettlement}
                    >
                        {loading ? "Processing..." : "Confirm Allocation"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}