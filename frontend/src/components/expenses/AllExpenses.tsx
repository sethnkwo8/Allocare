// All Expenses
"use client"

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ArrowLeft, Search, Calendar, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import { expenseCategoryColors } from "@/lib/expenses/expenseCategoryColors";
import { useExpense } from "@/hooks/useExpense";
import { ExpenseActions } from "./ExpenseActions";
import { deleteExpense } from "@/lib/api/expenses";

export function AllExpenses() {
    // Custom hook returns
    const { data, isLoading, errorData, refresh } = useExpense()

    // Router for navigation
    const router = useRouter()

    // State for search query
    const [searchQuery, setSearchQuery] = useState("");

    // State to store current page
    const [currentPage, setCurrentPage] = useState(1);

    // Expenses per page
    const itemsPerPage = 10;

    // Reset to page 1 whenever the search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Filter expenses based on search query
    const filteredExpenses = (data || []).filter((expense) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            expense.title.toLowerCase().includes(searchLower) ||
            expense.category_name.toLowerCase().includes(searchLower) || // ADD THIS
            expense.notes?.toLowerCase().includes(searchLower) ||
            expense.amount.toString().includes(searchLower)
        );
    });

    // Calculate pagination
    const totalItems = filteredExpenses.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentExpenses = filteredExpenses.slice(startIndex, startIndex + itemsPerPage);

    // Function to handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Function to handle expense delete
    async function onDelete(id: string) {
        if (!confirm("Are you sure you want to delete this expense? This action cannot be undone.")) {
            return;
        }

        try {
            // Delete call
            await deleteExpense(id)
            // Refresh page
            refresh()
        } catch (error: any) {
            alert(error.message)
            console.error(error)
        }
    }

    const currencySymbol = "₦";

    // Loading skeleton
    if (isLoading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <h1 className="text-2xl font-bold text-[#2E6B6B] animate-pulse mb-4">
                Allocare
            </h1>
            <div className="w-8 h-8 border-4 border-[#2E6B6B] border-t-transparent rounded-full animate-spin"></div>
        </div>
    )
    if (errorData) return <div>Error: {errorData}</div>
    if (!data) return null

    return (
        <div className="min-h-screen bg-linear-to-br from-[#d4f1f1] to-[#e6f5f5] p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => router.push("/dashboard")}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="font-semibold text-3xl text-[#2E6B6B]">All Expenses</h1>
                            <p className="text-muted-foreground">View and manage all your expenses</p>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <Card className="p-2 border-none shadow-sm ring-1 ring-slate-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search title, category, or notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 border-none focus-visible:ring-0 text-base"
                        />
                    </div>
                </Card>

                {/* Expenses Table */}
                <Card className="border-none shadow-md overflow-hidden bg-white">
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Title/Note</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="w-12.5"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentExpenses.length > 0 ? (
                                    currentExpenses.map((expense) => (
                                        <TableRow key={expense.id}>
                                            <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                                                {new Date(expense.date).toLocaleString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false
                                                }).replace(',', '')}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{expense.title}</div>
                                                    {expense.notes && (
                                                        <div className="text-sm text-muted-foreground mt-1">
                                                            {expense.notes}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className="flex items-center gap-2 w-fit"
                                                >
                                                    <div
                                                        className={`h-2 w-2 rounded-full ${expenseCategoryColors[expense.category_name] || "bg-gray-500"
                                                            }`}
                                                    />
                                                    {expense.category_name}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                -{currencySymbol}{(Number(expense.amount) || 0).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <ExpenseActions onDelete={() => onDelete(expense.id)} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2">
                                                <Search className="h-8 w-8 opacity-20" />
                                                <p>No expenses found matching "{searchQuery}"</p>
                                                <Button
                                                    variant="link"
                                                    onClick={() => setSearchQuery("")}
                                                    className="text-[#2E6B6B]"
                                                >
                                                    Clear search
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-slate-100">
                        {currentExpenses.length > 0 ? (
                            currentExpenses.map((expense) => (
                                <div key={expense.id} className="p-4 active:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-slate-900">{expense.title}</span>
                                        <span className="font-bold text-red-600">
                                            -{currencySymbol}{Number(expense.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 items-center text-xs text-slate-500 mb-2">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(expense.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Tag className="h-3 w-3" />
                                            {expense.category_name}
                                        </div>
                                    </div>
                                    {expense.notes && <p className="text-sm text-slate-500 italic bg-slate-50 p-2 rounded">"{expense.notes}"</p>}
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center">
                                <EmptySearchState onClear={() => setSearchQuery("")} searchQuery={searchQuery} />
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t gap-4">
                            <div className="text-sm text-muted-foreground order-2 sm:order-1">
                                Showing <span className="font-medium text-foreground">{startIndex + 1}</span> to{" "}
                                <span className="font-medium text-foreground">{Math.min(endIndex, filteredExpenses.length)}</span> of{" "}
                                <span className="font-medium text-foreground">{filteredExpenses.length}</span> expenses
                            </div>
                            <div className="flex items-center gap-2 order-1 sm:order-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="h-8 px-2 lg:px-3"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    <span className="hidden sm:inline">Previous</span>
                                </Button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(page =>
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                        )
                                        .map((page, index, array) => (
                                            <div key={page} className="flex items-center">
                                                {index > 0 && array[index - 1] !== page - 1 && (
                                                    <span className="px-2 text-muted-foreground">...</span>
                                                )}
                                                <Button
                                                    variant={currentPage === page ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handlePageChange(page)}
                                                    className={`h-8 w-8 p-0 ${currentPage === page
                                                        ? "bg-[#2E6B6B] hover:bg-[#2E6B6B]/90 text-white shadow-sm"
                                                        : "hover:text-[#2E6B6B] hover:border-[#2E6B6B]"
                                                        }`}
                                                >
                                                    {page}
                                                </Button>
                                            </div>
                                        ))}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="h-8 px-2 lg:px-3"
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}

function EmptySearchState({ searchQuery, onClear }: { searchQuery: string, onClear: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
                <Search className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-900 font-semibold text-lg">No expenses found</p>
            <p className="text-slate-500 text-sm max-w-62.5 text-center mb-6">
                We couldn't find anything matching "{searchQuery}"
            </p>
            <Button onClick={onClear} variant="outline" className="text-[#2E6B6B] border-[#2E6B6B]/20 hover:bg-[#2E6B6B]/5">
                Clear all filters
            </Button>
        </div>
    )
}
