"use client"

import { Head, router, useForm } from "@inertiajs/react"
import type { FormEventHandler } from "react"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { toast } from "sonner"

interface Receipt {
    id: number
    vendor_name: string | null
    amount: number | null
    receipt_date: string | null
    category_id: number | null
    notes: string | null
    image_url: string
}

interface Category {
    id: number
    name: string
    color: string
}

interface ReceiptEditProps {
    receipt: Receipt
    categories: Category[]
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Receipts",
        href: "/receipts",
    },
    {
        title: "Edit Receipt",
        href: "#",
    },
]

export default function ReceiptEdit({ receipt, categories }: ReceiptEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        vendor_name: receipt.vendor_name || "",
        amount: receipt.amount || "",
        receipt_date: receipt.receipt_date || "",
        category_id: receipt.category_id || "",
        notes: receipt.notes || "",
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()

        put(`/receipts/${receipt.id}`, {
            onSuccess: () => {
                toast("Receipt updated successfully")
                router.get(`/receipts/${receipt.id}`)
            },
            onError: () => {
                toast("Failed to update receipt")
            },
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Receipt" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => router.get(`/receipts/${receipt.id}`)}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Edit Receipt</h1>
                            <p className="text-muted-foreground">Update receipt information</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Receipt Image */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Receipt Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <img
                                src={receipt.image_url || "/placeholder.svg"}
                                alt="Receipt"
                                className="w-full max-h-96 object-contain rounded-md bg-muted"
                            />
                        </CardContent>
                    </Card>

                    {/* Edit Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Receipt Details</CardTitle>
                            <CardDescription>Edit the extracted information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <Label htmlFor="vendor_name">Vendor Name</Label>
                                    <Input
                                        id="vendor_name"
                                        value={data.vendor_name}
                                        onChange={(e) => setData("vendor_name", e.target.value)}
                                        placeholder="Enter vendor name"
                                    />
                                    {errors.vendor_name && <p className="text-sm text-red-600 mt-1">{errors.vendor_name}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="amount">Amount</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        value={data.amount}
                                        onChange={(e) => setData("amount", e.target.value)}
                                        placeholder="0.00"
                                    />
                                    {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="receipt_date">Receipt Date</Label>
                                    <Input
                                        id="receipt_date"
                                        type="date"
                                        value={data.receipt_date}
                                        onChange={(e) => setData("receipt_date", e.target.value)}
                                    />
                                    {errors.receipt_date && <p className="text-sm text-red-600 mt-1">{errors.receipt_date}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="category_id">Category</Label>
                                    <Select
                                        value={data.category_id.toString()}
                                        onValueChange={(value) => setData("category_id", Number.parseInt(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                                                        {category.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category_id && <p className="text-sm text-red-600 mt-1">{errors.category_id}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData("notes", e.target.value)}
                                        placeholder="Add any notes about this receipt..."
                                        rows={3}
                                    />
                                    {errors.notes && <p className="text-sm text-red-600 mt-1">{errors.notes}</p>}
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button type="submit" disabled={processing} className="flex-1">
                                        <Save className="h-4 w-4 mr-2" />
                                        {processing ? "Saving..." : "Save Changes"}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => router.get(`/receipts/${receipt.id}`)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
