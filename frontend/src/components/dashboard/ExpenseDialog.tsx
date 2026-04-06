// Expense dialog
"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ExpenseDialogProps, ExpenseForm } from "@/types/dashboard";
import { createExpense } from "@/lib/api/dashboard";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { updateExpense } from "@/lib/api/expenses";

export function ExpenseDialog({
    categories,
    isExpenseDialogOpen,
    setIsExpenseDialogOpen,
    expenseForm,
    setExpenseForm,
    onRefresh,
    mode = "add", // add as default
    expenseId = null // expense id if editing
}: ExpenseDialogProps & { mode?: "add" | "edit", expenseId?: string | null }) {

    // Loading state for submission
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    // Handle Expense submit
    async function handleExpenseSubmit(expenseForm: ExpenseForm) {
        if (!expenseForm.amount || !expenseForm.title || !expenseForm.category) {
            alert("Please fill in the required fields");
            return;
        }

        // Start loading
        setIsSubmitting(true);

        // API call
        try {
            if (mode === "edit" && expenseId) {
                // If mode is edit call update api cal;
                await updateExpense(expenseId, expenseForm)
            } else {
                // If mode is add call create call
                await createExpense(expenseForm)
            }

            // Close dialog
            setIsExpenseDialogOpen(false)
            // Reset form
            setExpenseForm({ title: "", amount: "", category: "", description: "" });
            // Refresh page
            onRefresh()
        } catch (error: any) {
            alert(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>{mode === "edit" ? "Edit Expense" : "Add Expense"}</DialogTitle>
                    <DialogDescription>
                        {mode === "edit"
                            ? "Make changes to your expense details below."
                            : "Add a new expense to your financial overview."}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            type="text"
                            placeholder="Enter title"
                            value={expenseForm.title}
                            onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            inputMode="decimal" // Numeric keypad
                            placeholder="Enter amount"
                            value={expenseForm.amount}
                            onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                            value={expenseForm.category}
                            onValueChange={(value) => setExpenseForm({ ...expenseForm, category: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((c) => (
                                    <SelectItem key={c.category_id} value={c.category_id}>{c.category_name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Enter description"
                            value={expenseForm.description}
                            onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <Button variant="outline" disabled={isSubmitting} onClick={() => setIsExpenseDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        className="bg-[#2E6B6B] hover:bg-[#2E6B6B]/90 text-white"
                        disabled={isSubmitting}
                        onClick={() => handleExpenseSubmit(expenseForm)}
                    >
                        {isSubmitting ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {mode === "edit" ? "Updating..." : "Adding..."}</>
                        ) : (
                            mode === "edit" ? "Update Expense" : "Add Expense"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}