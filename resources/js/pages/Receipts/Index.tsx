"use client"

import { Head, router } from "@inertiajs/react"
import { useState } from "react"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, RefreshCw, Eye } from "lucide-react"
import { UploadReceiptModal } from "@/components/upload-receipt-modal"
import { toast } from "sonner"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Receipts",
        href: "/receipts",
    },
]

interface Receipt {
    id: number
    image_path: string
    image_url: string
    vendor_name: string | null
    category: {
        name: string
        color: string
    } | null
    amount: number | null
    receipt_date: string | null
    status: string
    confidence_score: number | null
    notes: string | null
    created_at: string
}

interface ReceiptsProps {
    receipts: {
        data: Receipt[]
        links: any[]
        meta: any
    }
    categories: Array<{
        id: number
        name: string
        color: string
        slug: string
    }>
    filters: {
        category?: string
        status?: string
        search?: string
    }
    message?: string
}

export default function ReceiptsIndex({ receipts, categories, filters, message }: ReceiptsProps) {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState(filters.search || "")

    if (message) {
        toast(message)
    }

    const handleSearch = (search: string) => {
        router.get("/receipts", { ...filters, search: search || undefined }, { preserveState: true, preserveScroll: true })
    }

    const handleFilterChange = (key: string, value: string) => {
        router.get("/receipts", { ...filters, [key]: value || undefined }, { preserveState: true, preserveScroll: true })
    }

    const handleDelete = (receipt: Receipt) => {
        if (confirm("Are you sure you want to delete this receipt?")) {
            router.delete(`/receipts/${receipt.id}`, {
                onSuccess: () => toast("Receipt deleted successfully"),
                onError: () => toast("Failed to delete receipt"),
            })
        }
    }

    const handleReprocess = (receipt: Receipt) => {
        router.post(
            `/receipts/${receipt.id}/reprocess`,
            {},
            {
                onSuccess: () => toast("Receipt reprocessing started"),
                onError: () => toast("Failed to reprocess receipt"),
            },
        )
    }

    const formatCurrency = (amount: number | null) => {
        if (amount === null) return "Processing..."
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount)
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Processing..."
        return new Date(dateString).toLocaleDateString()
    }

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            Restaurant: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
            Groceries: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
            Transport: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
            Shopping: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
            Entertainment: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
            Healthcare: "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300",
            Utilities: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
            Other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
        }
        return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Receipts" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">All Receipts</h1>
                        <p className="text-muted-foreground">Manage and view all your uploaded receipts</p>
                    </div>
                    <Button onClick={() => setIsUploadModalOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Receipt
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search receipts..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch(searchTerm)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Select
                                    value={filters.category || "all"}
                                    onValueChange={(value) => handleFilterChange("category", value)}
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.slug}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={filters.status || "all"} onValueChange={(value) => handleFilterChange("status", value)}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder="All Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="processed">Processed</SelectItem>
                                        <SelectItem value="failed">Failed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" onClick={() => handleSearch(searchTerm)}>
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Receipts Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Receipts ({receipts.meta})</CardTitle>
                        <CardDescription>All your uploaded and processed receipts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {receipts.data.length > 0 ? (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[80px]">Image</TableHead>
                                            <TableHead>Vendor</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Confidence</TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {receipts.data.map((receipt) => (
                                            <TableRow key={receipt.id}>
                                                <TableCell>
                                                    <img
                                                        src={receipt.image_url || "/placeholder.svg?height=48&width=48"}
                                                        alt="Receipt"
                                                        className="h-12 w-12 rounded-md object-cover cursor-pointer"
                                                        onClick={() => router.get(`/receipts/${receipt.id}`)}
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">{receipt.vendor_name || "Processing..."}</TableCell>
                                                <TableCell>
                                                    {receipt.category ? (
                                                        <Badge className={getCategoryColor(receipt.category.name)}>{receipt.category.name}</Badge>
                                                    ) : (
                                                        <Badge variant="secondary">Processing...</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>{formatDate(receipt.receipt_date)}</TableCell>
                                                <TableCell className="text-right font-medium">{formatCurrency(receipt.amount)}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            receipt.status === "processed"
                                                                ? "default"
                                                                : receipt.status === "failed"
                                                                    ? "destructive"
                                                                    : "secondary"
                                                        }
                                                    >
                                                        {receipt.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {receipt.confidence_score ? `${(receipt.confidence_score * 100).toFixed(0)}%` : "-"}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => router.get(`/receipts/${receipt.id}`)}>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => router.get(`/receipts/${receipt.id}/edit`)}>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            {(receipt.status === "failed" || receipt.status === "processed") && (
                                                                <DropdownMenuItem onClick={() => handleReprocess(receipt)}>
                                                                    <RefreshCw className="h-4 w-4 mr-2" />
                                                                    Reprocess
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuItem onClick={() => handleDelete(receipt)} className="text-red-600">
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Pagination */}
                                {receipts.links.length > 3 && (
                                    <div className="flex items-center justify-center gap-2 mt-4">
                                        {receipts.links.map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="mx-auto h-24 w-24 text-muted-foreground mb-4">
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium mb-2">No receipts found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {Object.keys(filters).length > 0
                                        ? "Try adjusting your filters or search terms"
                                        : "Upload your first receipt to get started"}
                                </p>
                                <Button onClick={() => setIsUploadModalOpen(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Your First Receipt
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Upload Modal */}
                <UploadReceiptModal open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen} categories={categories} />
            </div>
        </AppLayout>
    )
}
