"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Eye, Home, Package } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

interface OrderDetails {
  _id: string
  name: string
  email: string
  bookSize: string
  pageCount: number
  interiorColor: string
  paperType: string
  bindingType: string
  coverFinish: string
  totalPrice: number
  status: string
  orderDate: string
  paymentInfo: {
    paymentId: string
    transactionId: string
    status: string
    amount: number
    currency: string
  }
}

export default function SuccessPage() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  const orderId = searchParams.get("orderId")
  const paymentId = searchParams.get("paymentId")

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError("Order ID not found")
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`)
        const result = await response.json()

        if (response.ok && result.success) {
          setOrderDetails(result.order)
        } else {
          setError(result.error || "Failed to fetch order details")
        }
      } catch (err) {
        setError("Network error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  const handleGoToDashboard = () => {
    router.push("/dashboard/user")
  }

  const handleViewOrders = () => {
    router.push("/dashboard/user/orders")
  }

  const handleGoHome = () => {
    router.push("/")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Button onClick={handleGoToDashboard}>Go to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-600">
          Your book order has been confirmed and is being processed.
        </p>
      </div>

      {/* Order Details Card */}
      {orderDetails && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Details
            </CardTitle>
            <CardDescription>
              Order placed on{" "}
              {new Date(orderDetails.orderDate).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Order Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono">{orderDetails._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge
                      variant={
                        orderDetails.status === "paid" ? "default" : "secondary"
                      }
                    >
                      {orderDetails.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span>{orderDetails.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span>{orderDetails.email}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Book Specifications</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span>{orderDetails.bookSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pages:</span>
                    <span>{orderDetails.pageCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interior:</span>
                    <span>{orderDetails.interiorColor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paper:</span>
                    <span>{orderDetails.paperType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Binding:</span>
                    <span>{orderDetails.bindingType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cover:</span>
                    <span>{orderDetails.coverFinish}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Information */}
            <div>
              <h4 className="font-semibold mb-2">Payment Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-mono">
                      {orderDetails.paymentInfo.paymentId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono">
                      {orderDetails.paymentInfo.transactionId}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <Badge variant="default">
                      {orderDetails.paymentInfo.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-semibold text-lg">
                      ${orderDetails.paymentInfo.amount.toFixed(2)}{" "}
                      {orderDetails.paymentInfo.currency}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>What happens next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-100 p-1 mt-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
              <div>
                <h5 className="font-medium">Order Processing</h5>
                <p className="text-sm text-gray-600">
                  Your order is now being processed. We'll review your files and
                  prepare your book for printing.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-100 p-1 mt-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
              <div>
                <h5 className="font-medium">Quality Check</h5>
                <p className="text-sm text-gray-600">
                  Our team will perform a quality check on your book design and
                  content.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-100 p-1 mt-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
              <div>
                <h5 className="font-medium">Printing & Shipping</h5>
                <p className="text-sm text-gray-600">
                  Once approved, your book will be printed and shipped to you.
                  You'll receive tracking information via email.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={handleGoToDashboard}
          variant="default"
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          Make Another Order
        </Button>
        <Button
          onClick={handleGoHome}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Home
        </Button>
      </div>

      {/* Support Information */}
      {/* <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Need help? Contact our support team at{" "}
          <a href="mailto:support@yourcompany.com" className="text-[#1B463C] hover:underline">
            support@yourcompany.com
          </a>
        </p>
      </div> */}
    </div>
  );
}
