// Add goal dialog
"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { GoalDialogProps, GoalForm } from "@/types/dashboard";
import { createGoal } from "@/lib/api/dashboard";
import { updateGoal } from "@/lib/api/goals";
import { toast } from "sonner";

export function GoalDialog({
    isGoalDialogOpen,
    setIsGoalDialogOpen,
    goalForm,
    setGoalForm,
    onRefresh,
    mode = "add", // add as default
    goalId = null // goal id if editing
}: GoalDialogProps & { mode?: "add" | "edit", goalId?: string | null }) {

    // Submit state
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    // Handle goal submit
    async function handleGoalSubmit(goalForm: GoalForm) {
        if (!goalForm.name || !goalForm.target_amount || !goalForm.target_date) {
            toast.error("Missing Information", {
                description: "Please fill in all required fields, including the target date."
            });
            return;
        }

        const selectedDate = new Date(goalForm.target_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            toast.error("Invalid Date", {
                description: "Wait! The target date cannot be in the past. Please pick a future date."
            });
            return;
        }

        setIsSubmitting(true);

        try {
            if (mode === "edit" && goalId) {
                await updateGoal(goalId, goalForm);
            } else {
                await createGoal(goalForm);
            }

            setIsGoalDialogOpen(false);

            toast.success(mode === "edit" ? "Goal Updated" : "Goal Created! 🎯", {
                description: mode === "edit"
                    ? `Changes to "${goalForm.name}" have been saved.`
                    : `Time to start saving for ${goalForm.name}. You've got this!`,
            });

            setGoalForm({ name: "", target_amount: "", target_date: "", description: "" });
            onRefresh();
        } catch (error: any) {
            toast.error("Goal Error", {
                description: error.message || "We couldn't save your goal."
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>{mode === "edit" ? "Edit Goal" : "Add Goal"}</DialogTitle>
                    <DialogDescription>
                        {mode === "edit"
                            ? "Make changes to your goal details below."
                            : "Add a new goal to your financial overview."}
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
                            inputMode="decimal"
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
                        onClick={() => handleGoalSubmit(goalForm)}
                    >
                        {isSubmitting ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {mode === "edit" ? "Updating..." : "Adding..."}</>
                        ) : (
                            mode === "edit" ? "Update Goal" : "Add Goal"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}