// All Expenses
"use client"

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ArrowLeft, Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
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
            expense.title.toLowerCase().includes(searchLower) || // search by expense title
            expense.notes?.toLowerCase().includes(searchLower) || // search by expense notes
            expense.amount.toString().includes(searchLower) // search by expense amount
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
                            <h1 className="text-3xl">All Expenses</h1>
                            <p className="text-muted-foreground">View and manage all your expenses</p>
                        </div>
                    </div>
                    <Button
                        className="bg-[#2E6B6B] hover:bg-[#2E6B6B]/90 text-white"
                    // onClick={() => navigate("/dashboard")}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Expense
                    </Button>
                </div>

                {/* Search Bar */}
                <Card className="p-4 bg-white">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search expenses by name, category, or notes..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1); // Reset to first page on search
                            }}
                            className="pl-10"
                        />
                    </div>
                </Card>

                {/* Expenses Table */}
                <Card className="bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Title/Note</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentExpenses.length > 0 ? (
                                currentExpenses.map((expense) => (
                                    <TableRow key={expense.id}>
                                        <TableCell className="text-muted-foreground">
                                            {expense.date}
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
                                        {/* <TableCell className="text-right font-medium">
                                            -{currencySymbol}{expense.amount.toFixed(2)}
                                        </TableCell> */}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        No expenses found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

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
