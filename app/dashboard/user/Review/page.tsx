"use client";
import { Button } from "@/components/ui/button";
import PhotoBookReview from "./photo-book-review";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function Review() {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleConfirmAndPublish = async () => {
    setIsSubmitting(true);

    try {
      if (!cloudinaryUrl) {
        throw new Error("PDF file is required");
      }

      if (!coverCloudinaryUrl) {
        throw new Error("Cover image is required");
      }

      // Prepare order data with the specific fields requested
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

      console.log("Submitting order data:", orderData);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Order Confirmed!",
          description: "Your book order has been submitted successfully.",
        });

        // Redirect to success page or dashboard
        router.push("/dashboard/user");
      } else {
        throw new Error(result.error || "Failed to submit order");
      }
    } catch (error) {
      console.error("Order submission failed:", error);
      toast({
        title: "Order Failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an error submitting your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PhotoBookReview />
      <Button
        variant={"main"}
        size={"main"}
        className="w-full text-2xl"
        onClick={handleConfirmAndPublish}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Processing..." : "Confirm & Publish"}
      </Button>
    </>
  );
}
