// Add expense dialog
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

export function AddExpenseDialog({ data, isExpenseDialogOpen, setIsExpenseDialogOpen, expenseForm, setExpenseForm, onRefresh }: ExpenseDialogProps) {
    // Get categories
    const { category_spendings } = data

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

        try {
            // API call
            await createExpense(expenseForm)
            // Close dialog
            setIsExpenseDialogOpen(false)
            // Reset Expense Form
            setExpenseForm({ title: "", amount: "", category: "", description: "" });
            // Refresh
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
                    <DialogTitle>Add Expense</DialogTitle>
                    <DialogDescription>
                        Add a new expense to your financial overview.
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
                                {category_spendings.map((c) => (
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
                        onClick={() => {
                            handleExpenseSubmit(expenseForm)
                        }}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            "Add Expense"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}