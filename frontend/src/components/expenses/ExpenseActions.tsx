// Expense actions component
"use client"

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown";
import { Button } from "../ui/button";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { ExpenseResponse } from "@/types/expense";
export function ExpenseActions({
    expense,
    onEdit,
    onDelete
}: {
    expense: ExpenseResponse,
    onEdit(expense: ExpenseResponse): void,
    onDelete(id: string): void
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(expense)} className="cursor-pointer">
                    <Pencil className="mr-2 h-4 w-4 text-slate-500" />
                    <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(expense.id)} className="cursor-pointer text-red-600 focus:text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}