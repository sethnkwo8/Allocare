// Add expense dialog
"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ExpenseDialogProps } from "@/types/dashboard";

export function AddExpenseDialog({ isDialogOpen, setIsDialogOpen, expenseForm, setExpenseForm }: ExpenseDialogProps) {
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>Add Expense</DialogTitle>
                    <DialogDescription>
                        Add a new expense to your financial overview.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
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
                                <SelectItem value="housing">Housing</SelectItem>
                                <SelectItem value="groceries">Groceries</SelectItem>
                                <SelectItem value="utilities">Utilities</SelectItem>
                                <SelectItem value="transportation">Transportation</SelectItem>
                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                <SelectItem value="entertainment">Entertainment</SelectItem>
                                <SelectItem value="diningOut">Dining Out</SelectItem>
                                <SelectItem value="shopping">Shopping</SelectItem>
                                <SelectItem value="travel">Travel</SelectItem>
                                <SelectItem value="fitness">Fitness</SelectItem>
                                <SelectItem value="emergency">Emergency</SelectItem>
                                <SelectItem value="retirement">Retirement</SelectItem>
                                <SelectItem value="investments">Investments</SelectItem>
                                <SelectItem value="goals">Goals</SelectItem>
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
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        className="bg-[#2E6B6B] hover:bg-[#2E6B6B]/90 text-white"
                        onClick={() => {
                            // Handle form submission here
                            console.log('Expense added:', expenseForm);
                            setIsDialogOpen(false);
                            setExpenseForm({ amount: "", category: "", description: "" });
                        }}
                    >
                        Add Expense
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}