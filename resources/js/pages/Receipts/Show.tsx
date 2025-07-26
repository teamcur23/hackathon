"use client"

import { Head, router } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Trash2, RefreshCw, Download } from "lucide-react"
import { toast } from "sonner"

interface Receipt {
    id: number
    image_path: string
    image_url: string
    vendor_name: string | null
    category: {
        id: number
        name: string
        color: string
    } | null
    amount: number | null
    receipt_date: string | null
    status: string
    confidence_score: number | null
    notes: string | null
    ai_analysis: any
    created_at: string
    processed_at: string | null
}

interface ReceiptShowProps {
    receipt: Receipt
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Receipts",
        href: "/receipts",
    },
    {
        title: "Receipt Details",
        href: "#",
    },
]

export default function ReceiptShow({ receipt }: ReceiptShowProps) {
    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this receipt?")) {
            router.delete(`/receipts/${receipt.id}`, {
                onSuccess: () => {
                    toast("Receipt deleted successfully")
                    router.get("/receipts")
                },
                onError: () => toast("Failed to delete receipt"),
            })
        }
    }

    const handleReprocess = () => {
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
            currency: "ETB",
        }).format(amount)
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Processing..."
        return new Date(dateString).toLocaleDateString()
    }

    const formatDateTime = (dateString: string | null) => {
        if (!dateString) return "Processing..."
        return new Date(dateString).toLocaleString()
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Receipt - ${receipt.vendor_name || "Processing"}`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => router.get("/receipts")}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{receipt.vendor_name || "Processing Receipt"}</h1>
                            <p className="text-muted-foreground">Uploaded on {formatDateTime(receipt.created_at)}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Button variant="outline" onClick={() => router.get(`/receipts/${receipt.id}/edit`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                        {(receipt.status === "failed" || receipt.status === "processed") && (
                            <Button variant="outline" onClick={handleReprocess}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Reprocess
                            </Button>
                        )}
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Receipt Image */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Receipt Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                <img
                                    src={receipt.image_url || "/placeholder.svg"}
                                    alt="Receipt"
                                    className="w-full max-h-96 object-contain rounded-md bg-muted"
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                                    onClick={() => window.open(receipt.image_url, "_blank")}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Receipt Details */}
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Receipt Information</CardTitle>
                                <CardDescription>Extracted details from the receipt</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Status</label>
                                        <div className="mt-1">
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
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Confidence</label>
                                        <p className="mt-1 font-medium">
                                            {receipt.confidence_score ? `${(receipt.confidence_score * 100).toFixed(0)}%` : "N/A"}
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Vendor</label>
                                    <p className="mt-1 text-lg font-medium">{receipt.vendor_name || "Processing..."}</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Amount</label>
                                    <p className="mt-1 text-2xl font-bold">{formatCurrency(receipt.amount)}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Date</label>
                                        <p className="mt-1 font-medium">{formatDate(receipt.receipt_date)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Category</label>
                                        <div className="mt-1">
                                            {receipt.category ? (
                                                <Badge style={{ backgroundColor: receipt.category.color }}>{receipt.category.name}</Badge>
                                            ) : (
                                                <Badge variant="secondary">Processing...</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {receipt.notes && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Notes</label>
                                        <p className="mt-1 text-sm bg-muted p-3 rounded-md">{receipt.notes}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* AI Analysis Details */}
                        {receipt.ai_analysis && receipt.ai_analysis.items && receipt.ai_analysis.items.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Items Found</CardTitle>
                                    <CardDescription>Individual items detected by AI</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {receipt.ai_analysis.items.map((item: any, index: number) => (
                                            <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-md">
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    {item.quantity && <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>}
                                                </div>
                                                {item.price && <p className="font-medium">ETB {item.price.toFixed(2)}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Processing Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Processing Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Uploaded:</span>
                                    <span className="text-sm font-medium">{formatDateTime(receipt.created_at)}</span>
                                </div>
                                {receipt.processed_at && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Processed:</span>
                                        <span className="text-sm font-medium">{formatDateTime(receipt.processed_at)}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
