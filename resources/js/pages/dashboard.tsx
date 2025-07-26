import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, DollarSign, TrendingUp, TrendingDown, BarChart3, Calendar } from 'lucide-react';
import { type SharedData } from '@/types';

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Dashboard - Wechi" />
            
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {auth.user?.name || 'User'}!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Here's your financial overview for this month
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$1,247</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-600 flex items-center gap-1">
                                    <TrendingDown className="h-3 w-3" />
                                    -15% from last month
                                </span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Budget Remaining</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$753</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-blue-600">75% of budget used</span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">This Week</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$312</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-600 flex items-center gap-1">
                                    <TrendingDown className="h-3 w-3" />
                                    -8% from last week
                                </span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Daily</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$41.57</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-orange-600">+2.3% from average</span>
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Expenses */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Expenses</CardTitle>
                            <CardDescription>Your latest transactions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { name: 'Grocery Store', amount: 85.50, date: 'Today', category: 'Food' },
                                    { name: 'Gas Station', amount: 45.00, date: 'Yesterday', category: 'Transport' },
                                    { name: 'Coffee Shop', amount: 12.75, date: '2 days ago', category: 'Food' },
                                    { name: 'Movie Theater', amount: 28.00, date: '3 days ago', category: 'Entertainment' },
                                ].map((expense, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                                <DollarSign className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{expense.name}</p>
                                                <p className="text-sm text-gray-500">{expense.category} • {expense.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">${expense.amount}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Common tasks and shortcuts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Button className="w-full justify-start" size="lg">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New Expense
                                </Button>
                                <Button variant="outline" className="w-full justify-start" size="lg">
                                    <BarChart3 className="mr-2 h-4 w-4" />
                                    View Reports
                                </Button>
                                <Button variant="outline" className="w-full justify-start" size="lg">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Set Budget
                                </Button>
                                <Button variant="outline" className="w-full justify-start" size="lg">
                                    <TrendingUp className="mr-2 h-4 w-4" />
                                    Export Data
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
