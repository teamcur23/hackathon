"use client"

import { Head } from "@inertiajs/react"
import { router } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarDays, Download, Filter, TrendingDown, TrendingUp } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Reports",
        href: "/reports",
    },
]

interface ReportsProps {
    monthlyTrends: Array<{
        month: string
        amount: number
        count: number
        average: number
    }>
    categoryBreakdown: Array<{
        name: string
        amount: number
        count: number
        average: number
        percentage: number
        color: string
    }>
    statistics: {
        totalExpenses: number
        totalChange: number
        averageMonthly: number
        averageChange: number
        receiptsProcessed: number
        countChange: number
        highestCategory: {
            name: string
            amount: number
            percentage: number
        } | null
    }
    topVendors: Array<{
        name: string
        total: number
        visits: number
        average: number
    }>
    dailyPattern: Array<{
        date: string
        total: number
        count: number
    }>
    period: string
    dateRange: {
        start: string
        end: string
    }
}

export default function Reports({
    monthlyTrends,
    categoryBreakdown,
    statistics,
    topVendors,
    dailyPattern,
    period,
    dateRange,
}: ReportsProps) {
    const handlePeriodChange = (newPeriod: string) => {
        router.get(
            "/reports",
            { period: newPeriod },
            {
                preserveState: true,
                preserveScroll: true,
            },
        )
    }

    const handleExport = (format: string) => {
        window.open(`/reports/export?period=${period}&format=${format}`, "_blank")
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "ETB", // Set currency to ETB
        }).format(amount)
    }

    const formatChangePercentage = (change: number) => {
        const isPositive = change > 0
        const Icon = isPositive ? TrendingUp : TrendingDown
        const colorClass = isPositive ? "text-green-600" : "text-red-600"

        return (
            <div className={`flex items-center gap-1 text-xs ${colorClass}`}>
                <Icon className="h-3 w-3" />
                <span>{Math.abs(change).toFixed(1)}%</span>
                <span className="text-muted-foreground">vs previous period</span>
            </div>
        )
    }

    const getCategoryColorClass = (colorHex: string) => {
        return { backgroundColor: colorHex }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
                        <p className="text-muted-foreground">
                            Detailed insights into your spending patterns from {dateRange.start} to {dateRange.end}
                        </p>
                    </div>
                    <div className="flex items-center flex-col gap-2">
                        <Select value={period} onValueChange={handlePeriodChange}>
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1month">Last Month</SelectItem>
                                <SelectItem value="3months">Last 3 Months</SelectItem>
                                <SelectItem value="6months">Last 6 Months</SelectItem>
                                <SelectItem value="1year">Last Year</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" className="gap-2 bg-transparent" onClick={() => handleExport("csv")}>
                            <Download className="h-4 w-4" />
                            Export CSV
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.totalExpenses > 0 ? formatCurrency(statistics.totalExpenses) : "No expenses"}
                            </div>
                            {statistics.totalExpenses > 0 && formatChangePercentage(statistics.totalChange)}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Monthly</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.averageMonthly > 0 ? formatCurrency(statistics.averageMonthly) : "N/A"}
                            </div>
                            {statistics.averageMonthly > 0 && formatChangePercentage(statistics.averageChange)}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Receipts Processed</CardTitle>
                            <Filter className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.receiptsProcessed}</div>
                            {statistics.receiptsProcessed > 0 && formatChangePercentage(statistics.countChange)}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Highest Category</CardTitle>
                            <Filter className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.highestCategory?.name || "N/A"}</div>
                            <p className="text-xs text-muted-foreground">
                                {statistics.highestCategory
                                    ? `${formatCurrency(statistics.highestCategory.amount)} (${statistics.highestCategory.percentage}%)`
                                    : "No data available"}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Monthly Trends */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Spending Trends</CardTitle>
                            <CardDescription>Your spending patterns over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={monthlyTrends}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(value, name) => [
                                                name === "amount" ? formatCurrency(value as number) : value,
                                                name === "amount" ? "Amount" : "Count",
                                            ]}
                                            labelFormatter={(label) => `Month: ${label}`}
                                        />
                                        <Line type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6" }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Category Breakdown</CardTitle>
                            <CardDescription>Spending distribution by category</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={categoryBreakdown}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => [formatCurrency(value as number), "Amount"]} />
                                        <Bar dataKey="amount" fill="#06b6d4" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Tables */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Category Analysis */}
                    <Card className=" w-full max-w-sm sm:max-w-full">
                        <CardHeader>
                            <CardTitle>Category Analysis</CardTitle>
                            <CardDescription>Detailed breakdown of spending by category</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4  ">
                                {categoryBreakdown.map((category) => (
                                    <div key={category.name} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded-full" style={getCategoryColorClass(category.color)} />
                                            <div>
                                                <p className="font-medium">{category.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {category.count} receipts • Avg: {formatCurrency(category.average)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{formatCurrency(category.amount)}</p>
                                            <p className="text-sm text-muted-foreground">{category.percentage}%</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Vendors */}
                    <Card className=" w-full max-w-sm sm:max-w-full">
                        <CardHeader>
                            <CardTitle>Top Vendors</CardTitle>
                            <CardDescription>Your most frequented businesses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {topVendors.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Vendor</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                            <TableHead className="text-right">Visits</TableHead>
                                            <TableHead className="text-right">Avg</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {topVendors.map((vendor, index) => (
                                            <TableRow key={vendor.name}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline">#{index + 1}</Badge>
                                                        <span className="font-medium">{vendor.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-medium">{formatCurrency(vendor.total)}</TableCell>
                                                <TableCell className="text-right">{vendor.visits}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(vendor.average)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">No vendor data available for this period</div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Daily Spending Pattern */}
                {dailyPattern.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Daily Spending Pattern</CardTitle>
                            <CardDescription>Total spending per day</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={dailyPattern}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(value) => [formatCurrency(value as number), "Total Amount"]}
                                            labelFormatter={(label) => `Date: ${label}`}
                                        />
                                        <Line type="monotone" dataKey="total" stroke="#10b981" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    )
}
