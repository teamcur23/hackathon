import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter, DollarSign, Calendar, Tag } from 'lucide-react';
import { type SharedData } from '@/types';

export default function Expenses() {
    const { auth } = usePage<SharedData>().props;

    const expenses = [
        { id: 1, name: 'Grocery Store', amount: 85.50, date: '2024-01-15', category: 'Food', description: 'Weekly groceries' },
        { id: 2, name: 'Gas Station', amount: 45.00, date: '2024-01-14', category: 'Transport', description: 'Fuel for car' },
        { id: 3, name: 'Coffee Shop', amount: 12.75, date: '2024-01-14', category: 'Food', description: 'Morning coffee' },
        { id: 4, name: 'Movie Theater', amount: 28.00, date: '2024-01-13', category: 'Entertainment', description: 'Weekend movie' },
        { id: 5, name: 'Restaurant', amount: 65.30, date: '2024-01-12', category: 'Food', description: 'Dinner with friends' },
        { id: 6, name: 'Online Shopping', amount: 120.00, date: '2024-01-11', category: 'Shopping', description: 'New clothes' },
        { id: 7, name: 'Gym Membership', amount: 45.00, date: '2024-01-10', category: 'Health', description: 'Monthly fee' },
        { id: 8, name: 'Electric Bill', amount: 89.50, date: '2024-01-09', category: 'Utilities', description: 'Monthly electricity' },
    ];

    const categories = ['All', 'Food', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Utilities'];

    return (
        <>
            <Head title="Expenses - Wechi" />
            
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Expenses
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Track and manage your expenses
                    </p>
                </div>

                {/* Filters and Search */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search expenses..."
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select defaultValue="All">
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Expense
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total This Month</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$1,247</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-600">-15% from last month</span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Per Day</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$41.57</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-orange-600">+2.3% from average</span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Categories Used</CardTitle>
                            <Tag className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">6</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-blue-600">Most: Food ($163.55)</span>
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Expenses List */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Expenses</CardTitle>
                        <CardDescription>Your complete expense history</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {expenses.map((expense) => (
                                <div key={expense.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                            <DollarSign className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{expense.name}</p>
                                            <p className="text-sm text-gray-500">{expense.description}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                    {expense.category}
                                                </span>
                                                <span className="text-xs text-gray-500">{expense.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-lg">${expense.amount}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
} 