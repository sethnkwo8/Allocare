// Deposit goal dialog
"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { PiggyBank, Loader2, AlertTriangle, ArrowRight } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useState } from "react"
import { DepositDialogProps } from "@/types/dashboard"
import { depositForGoal } from "@/lib/api/dashboard"
import { toast } from "sonner"
import Link from "next/link"

export function GoalDepositDialog({ goal, isOpen, onClose, onRefresh, currencySymbol, categories }: DepositDialogProps) {
    // Amount state
    const [amount, setAmount] = useState<string>("")

    // Submit state
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Find financial goals category
    const goalCategory = categories.find(c =>
        c.category_name.toLowerCase() === "financial goals"
    );

    // Calculation Logic
    const inputAmount = Number(amount) || 0;
    const currentSpent = parseFloat(String(goalCategory?.total_spent)) || 0;
    const limit = parseFloat(String(goalCategory?.budget_limit)) || 0;

    const isOverLimit = goalCategory && (currentSpent + inputAmount) > limit;
    const amountOver = (currentSpent + inputAmount) - limit;

    // Handle deposit action
    async function handleDeposit() {
        if (!amount || parseFloat(amount) <= 0) return;
        setIsSubmitting(true)
        try {
            // Call api
            await depositForGoal(amount, goal.id)
            // Success Popup!
            toast.success(`Successfully deposited ${currencySymbol}${amount} to ${goal.name}!`, {
                description: "Your goal progress has been updated.",
            });
            // Close dialog
            onClose()
            // Refresh page
            onRefresh()
            // Reset input
            setAmount("")
        } catch (error: any) {
            toast.error("Deposit Failed", {
                description: "We couldn't complete your deposit at this time. Please try again."
            });
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto bg-[#2E6B6B]/10 p-3 rounded-full mb-2">
                        <PiggyBank className="h-6 w-6 text-[#2E6B6B]" />
                    </div>
                    <DialogTitle className="text-center text-xl">
                        Deposit to {goal.name}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Warning Box */}
                    {isOverLimit && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 animate-in fade-in slide-in-from-top-1 duration-300">
                            <div className="flex gap-3">
                                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-amber-900 leading-tight">
                                        This exceeds your <strong>{goalCategory.category_name}</strong> allocation by <span className="font-bold">{currencySymbol}{amountOver.toLocaleString()}</span>.
                                    </p>
                                    <Link
                                        href="/profile-settings"
                                        className="text-xs font-bold text-[#2E6B6B] hover:underline flex items-center gap-1"
                                    >
                                        Adjust your monthly budget <ArrowRight className="h-3 w-3" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="amount" className="text-sm font-medium">Amount to Save</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                {currencySymbol}
                            </span>
                            <Input
                                id="amount"
                                type="number"
                                inputMode="decimal"
                                placeholder="0.00"
                                className="pl-8 h-12 text-lg"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-2">
                    <Button variant="outline" onClick={onClose} className="w-full sm:flex-1 h-11">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeposit}
                        disabled={isSubmitting || !amount}
                        className="w-full sm:flex-1 h-11 bg-[#2E6B6B] hover:bg-[#2E6B6B]/90 text-white"
                    >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Deposit"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}