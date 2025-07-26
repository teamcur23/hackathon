"use client"

import { useState } from "react"
import { Head, router } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem, DashboardStats, Receipt, MonthlySummary, Category } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, ReceiptIcon, DollarSign, TrendingUp, Calendar, TrendingDown, RefreshCw } from "lucide-react"
import { UploadReceiptModal } from "@/components/upload-receipt-modal"
import { MonthlyChart } from "@/components/monthly-chart"
import { toast } from "sonner"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
    },
]

interface DashboardProps {
    stats?: DashboardStats
    recentReceipts?: Receipt[]
    monthlyTrends?: Array<{
        month: string
        amount: number
        count: number
    }>
    currentSummary?: MonthlySummary | null
    categories?: Category[]
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

export default function Dashboard({
    stats = {
        totalSpent: 0,
        totalChange: 0,
        receiptCount: 0,
        countChange: 0,
        avgPerReceipt: 0,
        avgChange: 0,
        categoryCount: 0,
    },
    recentReceipts = [],
    monthlyTrends = [],
    currentSummary = null,
    categories = [],
}: DashboardProps) {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const handleRefresh = () => {
        setIsRefreshing(true)
        router.reload({
            onFinish: () => {
                setIsRefreshing(false)
                toast("Dashboard refreshed successfully")
            },
        })
    }

    const formatCurrency = (amount: number | null | undefined) => {
        if (amount === null || amount === undefined) return "Processing..."
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "ETB",
        }).format(amount)
    }

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return "Processing..."
        return new Date(dateString).toLocaleDateString()
    }

    const formatChangePercentage = (change: number) => {
        const isPositive = change > 0
        const Icon = isPositive ? TrendingUp : TrendingDown
        const colorClass = isPositive ? "text-green-600" : "text-red-600"

        return (
            <div className={`flex items-center gap-1 text-xs ${colorClass}`}>
                <Icon className="h-3 w-3" />
                <span>{Math.abs(change).toFixed(1)}%</span>
                <span className="text-muted-foreground">vs last month</span>
            </div>
        )
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 overflow-x-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Expense Tracker</h1>
                        <p className="text-muted-foreground">Track and analyze your expenses with AI-powered receipt scanning</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
                            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                        </Button>
                        <Button onClick={() => setIsUploadModalOpen(true)} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Analyze New Receipt
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.totalSpent)}</div>
                            {formatChangePercentage(stats.totalChange)}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Receipts</CardTitle>
                            <ReceiptIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.receiptCount}</div>
                            {formatChangePercentage(stats.countChange)}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg per Receipt</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.avgPerReceipt)}</div>
                            {formatChangePercentage(stats.avgChange)}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Categories</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.categoryCount}</div>
                            <p className="text-xs text-muted-foreground">Active categories</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Recent Receipts */}
                    <div className="md:col-span-2 w-full max-w-sm sm:max-w-full">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Receipts</CardTitle>
                                <CardDescription>Your latest uploaded and processed receipts</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {recentReceipts.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[80px]">Receipt</TableHead>
                                                <TableHead>Vendor</TableHead>
                                                <TableHead>Category</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead className="text-right">Amount</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recentReceipts.map((receipt) => (
                                                <TableRow key={receipt.id}>
                                                    <TableCell>
                                                        <img
                                                            src={receipt.image_url || "/placeholder.svg?height=48&width=48"}
                                                            alt="Receipt"
                                                            className="h-12 w-12 rounded-md object-cover"
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
                                                        <Badge variant={receipt.status === "processed" ? "default" : "secondary"}>
                                                            {receipt.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-8">
                                        <ReceiptIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground">No receipts uploaded yet</p>
                                        <Button onClick={() => setIsUploadModalOpen(true)} className="mt-4" variant="outline">
                                            Upload Your First Receipt
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Monthly Summary */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Monthly Breakdown</CardTitle>
                                <CardDescription>Spending by category this month</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {currentSummary?.category_breakdown && currentSummary.category_breakdown.length > 0 ? (
                                    <>
                                        <MonthlyChart data={currentSummary.category_breakdown} />
                                        <div className="mt-4 space-y-2">
                                            {currentSummary.category_breakdown.map((category) => (
                                                <div key={category.name} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                                                        <span className="text-sm">{category.name}</span>
                                                    </div>
                                                    <span className="text-sm font-medium">{formatCurrency(category.amount)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground">No spending data for this month</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Upload Modal */}
                <UploadReceiptModal open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen} categories={categories} />
            </div>
        </AppLayout>
    )
}
