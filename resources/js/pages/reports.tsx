<<<<<<< Updated upstream
import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, BarChart3, PieChart, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { type SharedData } from '@/types';

export default function Reports() {
    const { auth } = usePage<SharedData>().props;

    const categoryData = [
        { category: 'Food', amount: 163.55, percentage: 32.7, color: 'bg-blue-500' },
        { category: 'Transport', amount: 45.00, percentage: 9.0, color: 'bg-green-500' },
        { category: 'Entertainment', amount: 28.00, percentage: 5.6, color: 'bg-purple-500' },
        { category: 'Shopping', amount: 120.00, percentage: 24.0, color: 'bg-orange-500' },
        { category: 'Health', amount: 45.00, percentage: 9.0, color: 'bg-red-500' },
        { category: 'Utilities', amount: 89.50, percentage: 17.9, color: 'bg-yellow-500' },
    ];

    const monthlyData = [
        { month: 'Jan', amount: 1247 },
        { month: 'Dec', amount: 1468 },
        { month: 'Nov', amount: 1320 },
        { month: 'Oct', amount: 1189 },
        { month: 'Sep', amount: 1420 },
        { month: 'Aug', amount: 1350 },
    ];

    return (
        <>
            <Head title="Reports - Wechi" />
            
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Reports & Analytics
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Analyze your spending patterns and financial insights
                    </p>
                </div>

                {/* Controls */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-medium">Period:</span>
                            </div>
                            <Select defaultValue="month">
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Select period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="week">This Week</SelectItem>
                                    <SelectItem value="month">This Month</SelectItem>
                                    <SelectItem value="quarter">This Quarter</SelectItem>
                                    <SelectItem value="year">This Year</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Export Report
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$500.05</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-600">-15% from last period</span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Daily</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$16.67</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-orange-600">+2.3% from average</span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Food</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-blue-600">32.7% of total</span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                            <PieChart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">8</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-600">This period</span>
=======
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
        day: string
        average: number
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
            currency: "ETB",
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
                    <div className="flex items-center gap-2">
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
                            <div className="text-2xl font-bold">{formatCurrency(statistics.totalExpenses)}</div>
                            {formatChangePercentage(statistics.totalChange)}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Monthly</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(statistics.averageMonthly)}</div>
                            {formatChangePercentage(statistics.averageChange)}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Receipts Processed</CardTitle>
                            <Filter className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.receiptsProcessed}</div>
                            {formatChangePercentage(statistics.countChange)}
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
>>>>>>> Stashed changes
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
<<<<<<< Updated upstream
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Category Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Spending by Category</CardTitle>
                            <CardDescription>Breakdown of your expenses by category</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {categoryData.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                                            <span className="font-medium">{item.category}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">${item.amount}</div>
                                            <div className="text-sm text-gray-500">{item.percentage}%</div>
                                        </div>
                                    </div>
                                ))}
=======
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
>>>>>>> Stashed changes
                            </div>
                        </CardContent>
                    </Card>

<<<<<<< Updated upstream
                    {/* Monthly Trend */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Spending Trend</CardTitle>
                            <CardDescription>Your spending pattern over the last 6 months</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {monthlyData.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="font-medium">{item.month}</span>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-blue-600 h-2 rounded-full" 
                                                    style={{ width: `${(item.amount / 1500) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium">${item.amount}</span>
                                        </div>
                                    </div>
                                ))}
=======
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
>>>>>>> Stashed changes
                            </div>
                        </CardContent>
                    </Card>
                </div>

<<<<<<< Updated upstream
                {/* Insights */}
                <Card>
                    <CardHeader>
                        <CardTitle>Financial Insights</CardTitle>
                        <CardDescription>AI-powered insights about your spending habits</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                                        🎉 Great Progress!
                                    </h4>
                                    <p className="text-green-700 dark:text-green-300 text-sm">
                                        You've reduced your spending by 15% compared to last month. Keep up the good work!
                                    </p>
                                </div>
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                                        💡 Spending Tip
                                    </h4>
                                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                                        Your food expenses are 32.7% of total spending. Consider meal planning to reduce costs.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                    <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                                        ⚠️ Budget Alert
                                    </h4>
                                    <p className="text-orange-700 dark:text-orange-300 text-sm">
                                        You're on track to exceed your monthly budget by $53. Consider reducing non-essential expenses.
                                    </p>
                                </div>
                                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                                        📊 Trend Analysis
                                    </h4>
                                    <p className="text-purple-700 dark:text-purple-300 text-sm">
                                        Your spending has been decreasing over the past 3 months. This is a positive trend!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
} 
=======
                {/* Detailed Tables */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Category Analysis */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Category Analysis</CardTitle>
                            <CardDescription>Detailed breakdown of spending by category</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {categoryBreakdown.map((category) => (
                                    <div key={category.name} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
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
                    <Card>
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
                            <CardDescription>Average spending by day of the week</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dailyPattern}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(value) => [formatCurrency(value as number), "Average Amount"]}
                                            labelFormatter={(label) => `${label}`}
                                        />
                                        <Bar dataKey="average" fill="#10b981" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    )
}
>>>>>>> Stashed changes
