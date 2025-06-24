"use client";
import { Button } from "@/components/ui/button";
import PhotoBookReview from "./photo-book-review";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { PaymentForm } from "@/components/ui/payment-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Review() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Get data from Redux store
  const design = useSelector((state: RootState) => state.design);
  const authData = useSelector((state: RootState) => state.auth);
  const cloudinaryUrl = useSelector(
    (state: RootState) => state.design.processedPDF?.cloudinaryUrl
  );
  const coverCloudinaryUrl = useSelector(
    (state: RootState) => state.design.processedCover?.cloudinaryUrl
  );

  const handleInitiatePayment = () => {
    // Validate required data before showing payment form
    if (!cloudinaryUrl) {
      toast({
        title: "Missing PDF File",
        description: "Please upload your PDF file before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (!coverCloudinaryUrl) {
      toast({
        title: "Missing Cover Image",
        description: "Please upload your cover image before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (!design.totalPrice || design.totalPrice <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please ensure your book has a valid price.",
        variant: "destructive",
      });
      return;
    }

    setPaymentError(null);
    setShowPaymentDialog(true);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    setIsProcessing(true);

    try {
      // Prepare order data
      const orderData = {
        name: authData.user?.name,
        email: authData.user?.email,
        pdfCloudinaryUrl: cloudinaryUrl,
        coverCloudinaryUrl: coverCloudinaryUrl,
        bookSize: design.bookSize || "8.5x11",
        pageCount: design.pageCount,
        interiorColor: design.interiorColor || "Black & White",
        paperType: design?.paperType || "Standard",
        bindingType: design?.bindingType || "Perfect Bound",
        coverFinish: design?.coverFinish || "Matte",
        totalPrice: design.totalPrice,
      };

      // Create order with payment confirmation
      const response = await fetch("/api/orders/create-with-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderData,
          paymentData: {
            paymentId: paymentData.paymentId,
            transactionId: paymentData.transactionId,
            status: paymentData.status,
          },
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setShowPaymentDialog(false);

        toast({
          title: "Order Confirmed!",
          description:
            "Your payment was successful and your book order has been confirmed.",
        });

        // Navigate to success page with order details
        router.push(
          `/dashboard/user/success?orderId=${result.orderId}&paymentId=${result.paymentId}`
        );
      } else {
        throw new Error(result.error || "Failed to create order after payment");
      }
    } catch (error) {
      console.error("Order creation failed after payment:", error);
      setPaymentError(
        error instanceof Error
          ? error.message
          : "Failed to create order after payment. Please contact support."
      );

      toast({
        title: "Order Creation Failed",
        description:
          "Payment was successful but order creation failed. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <>
      <PhotoBookReview />

      <Button
        variant={"main"}
        size={"main"}
        className="w-full text-2xl"
        onClick={handleInitiatePayment}
        disabled={isProcessing}
      >
        {isProcessing
          ? "Processing..."
          : `Confirm & Pay $${design.totalPrice?.toFixed(2) || "0.00"}`}
      </Button>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto custom-scroll">
          <DialogHeader>
            <DialogTitle>Complete Your Payment</DialogTitle>
            <DialogDescription>
              Secure payment processing for your book order
            </DialogDescription>
          </DialogHeader>

          {paymentError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{paymentError}</AlertDescription>
            </Alert>
          )}

          <PaymentForm
            amount={design.totalPrice || 0}
            currency="USD"
            description={`Book Order - ${design.bookSize || "Custom"} Book`}
            customerName={authData.user?.name || ""}
            customerEmail={authData.user?.email || ""}
            orderId={`order-${Date.now()}`}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            isProcessing={isProcessing}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
