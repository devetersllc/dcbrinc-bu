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
  const startPage = useSelector((state: RootState) => state.startPage);
  const authData = useSelector((state: RootState) => state.auth);
  const general = useSelector((state: RootState) => state.general);
  const makeCard = useSelector((state: RootState) => state.makeCard);
  const cloudinaryUrl = useSelector(
    (state: RootState) => state.design.processedPDF?.cloudinaryUrl
  );
  const coverCloudinaryUrl = useSelector(
    (state: RootState) => state.design.processedCover?.cloudinaryUrl
  );

  const handleInitiatePayment = () => {
    // Check if user is authenticated first
    if (!authData.isAuthenticated) {
      // Store current path to redirect back after login
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      router.push("/auth/login");
      return;
    }

    if (general.serviceType === "books") {
      // Validate book data
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
    } else if (general.serviceType === "cards") {
      // Validate card data
      if (!makeCard.companyName || !makeCard.name || !makeCard.jobTitle) {
        toast({
          title: "Incomplete Card Information",
          description:
            "Please complete all required card fields before proceeding.",
          variant: "destructive",
        });
        return;
      }
    }

    setPaymentError(null);
    setShowPaymentDialog(true);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    if (!authData.isAuthenticated) {
      // Store current path to redirect back after login
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      router.push("/auth/login");
      return;
    }

    setIsProcessing(true);

    try {
      if (general.serviceType === "books") {
        // Handle book order creation (existing logic)
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
          router.push(
            `/dashboard/user/success?orderId=${result.orderId}&paymentId=${result.paymentId}`
          );
        } else {
          throw new Error(
            result.error || "Failed to create order after payment"
          );
        }
      } else if (general.serviceType === "cards") {
        console.log("nfjkvnsfkjvsndfvkjdfk");
        const uploadFormData = new FormData();
        uploadFormData.append("image", makeCard.companyLogo?.file);
        uploadFormData.append("fileName", `card_${Date.now()}`);
        const uploadResponse = await fetch("/api/cards/upload-image", {
          method: "POST",
          body: uploadFormData,
        });
        const uploadResult = await uploadResponse.json();
        if (!uploadResult.success) {
          throw new Error("Failed to upload card image");
        }
        const orderData = {
          type: "card",
          name: authData.user?.name,
          email: authData.user?.email,
          cardData: {
            email: makeCard.email,
            companyName: makeCard.companyName,
            companyMessage: makeCard.companyMessage,
            selectedCard: makeCard.selectedCard,
            companyLogo: uploadResult.imageUrl || null,
            jobTitle: makeCard.jobTitle,
            phone: makeCard.phone.toString(),
            address: makeCard.address,
            website: makeCard.website || null,
            backgroundColor: makeCard.currentBgColor,
            textColor: makeCard.currentTextColor,
          },
          totalPrice: 25.0,
        };
        const orderResponse = await fetch("/api/orders/create-with-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderData,
            paymentData: {
              paymentId: paymentData.paymentId || "1234324325",
              transactionId: paymentData.transactionId || "423f5f235a3d45",
              status: paymentData.status || "pending",
            },
          }),
        });
        const orderResult = await orderResponse.json();
        if (orderResponse.ok && orderResult.success) {
          setShowPaymentDialog(false);
          toast({
            title: "Order Confirmed!",
            description:
              "Your payment was successful and your card order has been confirmed.",
          });
          router.push(
            `/dashboard/user/success?orderId=${orderResult.orderId}&paymentId=${orderResult.paymentId}`
          );
        } else {
          throw new Error(
            orderResult.error || "Failed to create card order after payment"
          );
        }
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
  const getPrice = () => {
    if (general.serviceType === "books") {
      return design.totalPrice || 0;
    } else if (general.serviceType === "cards") {
      return 25.0; // Default card price
    }
    return 0;
  };

  const getDescription = () => {
    if (general.serviceType === "books") {
      return `Book Order - ${design.bookSize || "Custom"} Book`;
    } else if (general.serviceType === "cards") {
      return "Business Card Order";
    }
    return "Order";
  };

  return (
    <>
      <PhotoBookReview />
      <Button
        variant={"main"}
        size={"main"}
        className="w-full text-2xl capitalize"
        // onClick={
        //   general.serviceType === "cards"
        //     ? handlePaymentSuccess
        //     : handleInitiatePayment
        // }
        onClick={handlePaymentSuccess}
        disabled={isProcessing}
      >
        {isProcessing
          ? "Processing..."
          : authData.isAuthenticated
          ? // ? `Confirm & Pay $${getPrice().toFixed(2)}`
            `${startPage.goal} Your Book`
          : `Sign in to ${
              startPage.goal === "publish" && general.serviceType !== "cards"
                ? startPage.goal
                : "pay"
            }`}
        {startPage.goal !== "publish" && <>${getPrice().toFixed(2)}</>}
      </Button>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto custom-scroll">
          <DialogHeader>
            <DialogTitle>Complete Your Payment</DialogTitle>
            <DialogDescription>
              Secure payment processing for your{" "}
              {general.serviceType === "books" ? "book" : "card"} order
            </DialogDescription>
          </DialogHeader>

          {paymentError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{paymentError}</AlertDescription>
            </Alert>
          )}

          <PaymentForm
            amount={getPrice()}
            currency="USD"
            description={getDescription()}
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
