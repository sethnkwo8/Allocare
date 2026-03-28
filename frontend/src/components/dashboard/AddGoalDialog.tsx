// Add goal dialog
"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { GoalDialogProps } from "@/types/dashboard";

export function AddGoalDialog({ data, isGoalDialogOpen, setIsGoalDialogOpen, goalForm, setGoalForm, onRefresh }: GoalDialogProps) {
    // Get goal savings
    const { goal_savings } = data;

    // Submit state
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    return (
        <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>Add Goal</DialogTitle>
                    <DialogDescription>
                        Add a new goal to your financial overview.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Goal Name</Label>
                        <Input
                            id="title"
                            type="text"
                            placeholder="Enter title"
                            value={goalForm.name}
                            onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="target_amount">Target Amount</Label>
                        <Input
                            id="target_amount"
                            type="number"
                            placeholder="Enter your target amount"
                            value={goalForm.target_amount}
                            onChange={(e) => setGoalForm({ ...goalForm, target_amount: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="target_date">Target Date</Label>
                        <Input
                            id="target_date"
                            type="date"
                            placeholder="Enter your target amount"
                            value={goalForm.target_date}
                            onChange={(e) => setGoalForm({ ...goalForm, target_date: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Enter description"
                            value={goalForm.description}
                            onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                    <Button variant="outline" disabled={isSubmitting} onClick={() => setIsGoalDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        className="bg-[#2E6B6B] hover:bg-[#2E6B6B]/90 text-white"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            "Add Goal"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}