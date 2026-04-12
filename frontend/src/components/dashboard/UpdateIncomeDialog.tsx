// Dialog to update income and frequency
"use client"
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "../ui/dialog"
import { Wallet, Loader2 } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select"
import { Button } from "../ui/button"
import { useState, useEffect } from "react"
import { UpdateIncomeDialogProps } from "@/types/dashboard"
import { SetIncomeFrequency } from "@/lib/api/onboarding"
import { toast } from "sonner"

export function UpdateIncomeDialog({ isOpen, onClose, onRefresh, currentIncome, currentFrequency, currencySymbol }: UpdateIncomeDialogProps) {
    // Amount state
    const [amount, setAmount] = useState<string>()

    // Frequency state
    const [frequency, setFrequency] = useState<string>()

    // Submitting state
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    // Input should update if data changes in backgroound
    useEffect(() => {
        if (isOpen) {
            setAmount(currentIncome.toString())
            setFrequency(currentFrequency || "monthly")
        }
    }, [isOpen, currentIncome, currentFrequency])

    // Handle income update function
    async function handleUpdate() {
        // Input validation
        if (!amount || parseFloat(amount) <= 0 || !frequency) return;

        // Set submitting state
        setIsSubmitting(true)

        try {
            // API call
            await SetIncomeFrequency(amount, frequency)
            // Success toast
            toast.success("Income Updated", {
                description: `Your ${frequency} budget has been recalibrated to ${currencySymbol}${amount}.`,
            });
            // Refresh page
            onRefresh()
            // Close dialog
            onClose()
        } catch (error: any) {
            console.error(error)
            toast.error("Update Failed", {
                description: "We couldn't update your income settings. Please try again."
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
                        <Wallet className="h-6 w-6 text-[#2E6B6B]" />
                    </div>
                    <DialogTitle className="text-center text-xl">Update Monthly Income</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="income-amount">Total Income</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                {currencySymbol}
                            </span>
                            <Input
                                id="income-amount"
                                type="number"
                                className="pl-8 h-12 text-lg"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Frequency</Label>
                        <Select value={frequency} onValueChange={setFrequency}>
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
                    <Button variant="outline" onClick={onClose} className="w-full sm:flex-1">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpdate}
                        disabled={isSubmitting || !amount}
                        className="w-full sm:flex-1 bg-[#2E6B6B] hover:bg-[#2E6B6B]/90 text-white"
                    >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}