// Deposit goal dialog
"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { PiggyBank, Loader2 } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useState } from "react"
import { DepositDialogProps } from "@/types/dashboard"
import { depositForGoal } from "@/lib/api/dashboard"

export function GoalDepositDialog({ goal, isOpen, onClose, onRefresh, currencySymbol }: DepositDialogProps) {
    // Amount state
    const [amount, setAmount] = useState<string>("")

    // Submit state
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Handle deposit action
    async function handleDeposit() {
        if (!amount || parseFloat(amount) <= 0) return;
        setIsSubmitting(true)
        try {
            // Call api
            await depositForGoal(amount, goal.id)
            // Refresh page
            onRefresh()
            // Close dialog
            onClose()
            // Reset input
            setAmount("")
        } catch (error: any) {
            alert("We couldn't complete your deposit at this time")
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

                <div className="space-y-6 py-6">
                    <div className="space-y-2">
                        <Label htmlFor="amount" className="text-sm font-medium">Amount to Save</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                {currencySymbol}
                            </span>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="0.00"
                                className="pl-8 h-12 text-lg"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:flex-1 h-11"
                    >
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