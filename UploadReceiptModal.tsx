"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import { router } from "@inertiajs/react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, X, Check, Loader2, Camera, FileImage, AlertCircle, CameraOff, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Category } from "@/types"
import { toast } from "sonner"

interface UploadReceiptModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    categories: Category[]
}

interface AnalyzedData {
    vendor_name: string | null
    amount: number | null
    receipt_date: string | null
    category: string | null
    confidence: number
    items?: Array<{
        name: string
        price: number
        quantity: string | null
    }>
}

export function UploadReceiptModal({ open, onOpenChange, categories = [] }: UploadReceiptModalProps) {
    const [dragActive, setDragActive] = useState(false)
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analyzedData, setAnalyzedData] = useState<AnalyzedData | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [notes, setNotes] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [receiptId, setReceiptId] = useState<number | null>(null)

    // Camera states
    const [showCamera, setShowCamera] = useState(false)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [isCameraLoading, setIsCameraLoading] = useState(false)
    const [capturedImage, setCapturedImage] = useState<string | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }, [])

    const handleFile = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file")
            return
        }

        if (file.size > 10 * 1024 * 1024) {
            // 10MB
            setError("File size must be less than 10MB")
            return
        }

        setError(null)
        setUploadedFile(file)
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)

        await uploadAndAnalyze(file)
    }

    // Camera functions
    const startCamera = async () => {
        setIsCameraLoading(true)
        setError(null)

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Use back camera if available
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            })

            setStream(mediaStream)
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
            }
            setShowCamera(true)
        } catch (err) {
            console.error('Error accessing camera:', err)
            setError('Unable to access camera. Please check permissions and try again.')
        } finally {
            setIsCameraLoading(false)
        }
    }

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
        }
        setShowCamera(false)
        setCapturedImage(null)
    }

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current
            const canvas = canvasRef.current
            const context = canvas.getContext('2d')

            if (context) {
                // Set canvas size to match video
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight

                // Draw the video frame to canvas
                context.drawImage(video, 0, 0, canvas.width, canvas.height)

                // Convert to blob and create file
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], `receipt-${Date.now()}.jpg`, {
                            type: 'image/jpeg'
                        })

                        const imageUrl = URL.createObjectURL(blob)
                        setCapturedImage(imageUrl)
                        setPreviewUrl(imageUrl)
                        setUploadedFile(file)

                        // Stop camera after capture
                        stopCamera()

                        // Upload the captured image
                        uploadAndAnalyze(file)
                    }
                }, 'image/jpeg', 0.9)
            }
        }
    }

    const uploadAndAnalyze = async (file: File) => {
        setIsUploading(true)
        setIsAnalyzing(true)

        const formData = new FormData()
        formData.append("image", file)
        formData.append("notes", notes)

        router.post("/receipts", formData, {
            onSuccess: (page: any) => {
                const receipt = page.props.receipt
                if (receipt) {
                    setReceiptId(receipt.id)
                    setIsUploading(false)
                    // Poll for analysis results
                    pollForAnalysis(receipt.id)
                }
            },
            onError: (errors: any) => {
                const errorMessage =
                    typeof errors === "object" ? (Object.values(errors)[0] as string) || "Upload failed" : "Upload failed"
                setError(errorMessage)
                setIsUploading(false)
                setIsAnalyzing(false)
                toast(errorMessage)
            },
        })
    }

    const pollForAnalysis = async (id: number) => {
        const maxAttempts = 30 // 30 seconds max
        let attempts = 0

        const poll = async () => {
            router.get(
                `/receipts/${id}`,
                {},
                {
                    onSuccess: (page: any) => {
                        const receipt = page.props.receipt

                        if (receipt?.status === "processed") {
                            setAnalyzedData({
                                vendor_name: receipt.vendor_name,
                                amount: receipt.amount,
                                receipt_date: receipt.receipt_date,
                                category: receipt.category?.name || null,
                                confidence: receipt.confidence_score || 0,
                                items: receipt.ai_analysis?.items || [],
                            })
                            setIsAnalyzing(false)
                            toast(
                                `Receipt analyzed! Found ${receipt.vendor_name || "receipt"} for ${receipt.amount ? `$${receipt.amount}` : "unknown amount"}`,
                            )
                            return
                        }

                        if (receipt?.status === "failed") {
                            setError("Analysis failed. Please try again.")
                            setIsAnalyzing(false)
                            return
                        }

                        attempts++
                        if (attempts < maxAttempts) {
                            setTimeout(poll, 1000) // Poll every second
                        } else {
                            setError("Analysis is taking longer than expected. Please check back later.")
                            setIsAnalyzing(false)
                        }
                    },
                    onError: () => {
                        attempts++
                        if (attempts < maxAttempts) {
                            setTimeout(poll, 1000)
                        } else {
                            setError("Failed to get analysis results")
                            setIsAnalyzing(false)
                        }
                    },
                    preserveState: true,
                    preserveScroll: true,
                    only: ["receipt"],
                },
            )
        }

        poll()
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
        }
    }

    const resetModal = () => {
        setUploadedFile(null)
        setPreviewUrl(null)
        setAnalyzedData(null)
        setIsUploading(false)
        setIsAnalyzing(false)
        setDragActive(false)
        setError(null)
        setNotes("")
        setReceiptId(null)
        setCapturedImage(null)
        stopCamera()
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
        }
        if (capturedImage) {
            URL.revokeObjectURL(capturedImage)
        }
    }

    const handleClose = () => {
        resetModal()
        onOpenChange(false)
        // Refresh the dashboard to show new receipt
        router.reload()
    }

    const handleSave = () => {
        toast("Receipt saved successfully!")
        handleClose()
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

    // Cleanup camera on unmount
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop())
            }
        }
    }, [stream])

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Analyze New Receipt</DialogTitle>
                    <DialogDescription>Upload a receipt image or capture one with your camera</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {!uploadedFile ? (
                        <div className="space-y-4">
                            {/* Camera Capture Section */}
                            {showCamera ? (
                                <div className="space-y-4">
                                    <div className="relative border rounded-lg overflow-hidden">
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            muted
                                            className="w-full h-64 object-cover"
                                        />
                                        <canvas ref={canvasRef} className="hidden" />

                                        {/* Camera Controls */}
                                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="bg-background/80 backdrop-blur-sm"
                                                onClick={stopCamera}
                                            >
                                                <CameraOff className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                size="icon"
                                                className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90"
                                                onClick={captureImage}
                                            >
                                                <Camera className="h-6 w-6" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">
                                            Position your receipt in the frame and tap the camera button to capture
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Upload Options */}
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {/* File Upload */}
                                        <div
                                            className={cn(
                                                "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
                                                dragActive
                                                    ? "border-primary bg-primary/5"
                                                    : "border-muted-foreground/25 hover:border-muted-foreground/50",
                                            )}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                        >
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileInput}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                disabled={isUploading}
                                            />
                                            <div className="flex flex-col items-center gap-3">
                                                <Upload className="h-8 w-8 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">Upload from device</p>
                                                    <p className="text-sm text-muted-foreground">Select an image file</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Camera Capture */}
                                        <div
                                            className={cn(
                                                "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
                                                isCameraLoading
                                                    ? "border-muted-foreground/25 bg-muted"
                                                    : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50"
                                            )}
                                            onClick={isCameraLoading ? undefined : startCamera}
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                {isCameraLoading ? (
                                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                                ) : (
                                                    <Camera className="h-8 w-8 text-muted-foreground" />
                                                )}
                                                <div>
                                                    <p className="font-medium">Take a photo</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {isCameraLoading ? "Starting camera..." : "Use your camera"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-xs text-muted-foreground">
                                            Supports JPG, PNG, HEIC, WebP up to 10MB
                                        </p>
                                    </div>
                                </>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes (optional)</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Add any notes about this receipt..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Preview and Analysis */}
                            <div className="grid gap-4 md:grid-cols-2">
                                {/* Image Preview */}
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="relative">
                                            <img
                                                src={previewUrl || "/placeholder.svg"}
                                                alt="Receipt preview"
                                                className="w-full h-64 object-contain rounded-md bg-muted"
                                            />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                                                onClick={resetModal}
                                                disabled={isUploading}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Analysis Results */}
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">AI Analysis</h3>
                                                {isUploading ? (
                                                    <Badge variant="secondary">Uploading...</Badge>
                                                ) : isAnalyzing ? (
                                                    <Badge variant="secondary">
                                                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                                        Analyzing...
                                                    </Badge>
                                                ) : analyzedData ? (
                                                    <Badge variant="default">
                                                        <Check className="h-3 w-3 mr-1" />
                                                        Complete
                                                    </Badge>
                                                ) : null}
                                            </div>

                                            {isUploading ? (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        <span className="text-sm">Uploading receipt...</span>
                                                    </div>
                                                </div>
                                            ) : isAnalyzing ? (
                                                <div className="space-y-3">
                                                    <div className="animate-pulse">
                                                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                                                        <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                                                        <div className="h-4 bg-muted rounded w-2/3"></div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        <span className="text-sm text-muted-foreground">AI is reading your receipt...</span>
                                                    </div>
                                                </div>
                                            ) : analyzedData ? (
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="text-sm font-medium text-muted-foreground">Vendor</label>
                                                        <p className="font-medium">{analyzedData.vendor_name || "Unknown"}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-muted-foreground">Amount</label>
                                                        <p className="font-medium text-lg">{formatCurrency(analyzedData.amount)}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-muted-foreground">Date</label>
                                                        <p className="font-medium">{formatDate(analyzedData.receipt_date)}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-muted-foreground">Category</label>
                                                        <div className="mt-1">
                                                            {analyzedData.category ? (
                                                                <Badge>{analyzedData.category}</Badge>
                                                            ) : (
                                                                <Badge variant="secondary">Other</Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-muted-foreground">Confidence</label>
                                                        <p className="text-sm">{(analyzedData.confidence * 100).toFixed(0)}% confident</p>
                                                    </div>
                                                    {analyzedData.items && analyzedData.items.length > 0 && (
                                                        <div>
                                                            <label className="text-sm font-medium text-muted-foreground">Items Found</label>
                                                            <div className="mt-1 space-y-1 max-h-32 overflow-y-auto">
                                                                {analyzedData.items.slice(0, 5).map((item, index) => (
                                                                    <div key={index} className="text-xs bg-muted p-2 rounded">
                                                                        <span className="font-medium">{item.name}</span>
                                                                        {item.price && <span className="float-right">${item.price.toFixed(2)}</span>}
                                                                    </div>
                                                                ))}
                                                                {analyzedData.items.length > 5 && (
                                                                    <p className="text-xs text-muted-foreground">
                                                                        +{analyzedData.items.length - 5} more items
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">Upload an image to start analysis</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Actions */}
                            {analyzedData && !isAnalyzing && (
                                <>
                                    <Separator />
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={resetModal}>
                                            Upload Another
                                        </Button>
                                        <Button onClick={handleSave}>Save Receipt</Button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}