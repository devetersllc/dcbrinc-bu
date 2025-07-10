"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CreditCard, AlertCircle, CheckCircle } from "lucide-react";

interface PaymentFormProps {
  onPaymentSuccess?: (result: any) => void;
  onPaymentError?: (error: string) => void;
}

export function PaymentForm({
  onPaymentSuccess,
  onPaymentError,
}: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const [formData, setFormData] = useState({
    amount: 29.99,
    currency: "USD",
    description: "Test Payment",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    orderId: `order-${Date.now()}`,
    cardData: {
      number: "4111111111111111",
      expMonth: "12",
      expYear: "25",
      cvc: "123",
      name: "John Doe",
      address: {
        streetAddress: "123 Main St",
        city: "Anytown",
        region: "CA",
        country: "US",
        postalCode: "12345",
      },
    },
  });

  // Check for OAuth return and auto-process payment
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
    const autoProcess = urlParams.get("auto_process");
    const error = urlParams.get("error");

    if (error) {
      setResult({
        success: false,
        message: `OAuth Error: ${error}`,
      });
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (success && autoProcess === "true") {
      // Auto-process pending payment after successful OAuth
      const pendingPayment = sessionStorage.getItem("pendingPaymentData");
      if (pendingPayment) {
        try {
          const paymentData = JSON.parse(pendingPayment);
          setFormData(paymentData);
          setResult({
            success: true,
            message: success,
          });
          // Auto-process the payment
          setTimeout(() => {
            processPayment(paymentData);
          }, 2000);
        } catch (e) {
          console.error("Failed to parse pending payment data:", e);
        }
      }
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (success) {
      setResult({
        success: true,
        message: success,
      });
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleInputChange = (field: string, value: string | number) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      if (parent === "cardData" && child === "address") {
        return;
      }
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      cardData: {
        ...prev.cardData,
        address: {
          ...prev.cardData.address,
          [field]: value,
        },
      },
    }));
  };

  const processPayment = async (paymentData = formData) => {
    setIsProcessing(true);
    setResult(null);
    setProcessingStep("Validating payment information...");

    try {
      // Store payment data for potential OAuth flow
      sessionStorage.setItem("pendingPaymentData", JSON.stringify(paymentData));

      setProcessingStep("Processing payment...");

      // Call the unified payment API
      const response = await fetch("/api/payments/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          success: true,
          message: "🎉 Payment processed successfully!",
          details: data,
        });
        onPaymentSuccess?.(data);
        // Clear stored payment data on success
        sessionStorage.removeItem("pendingPaymentData");
      } else {
        // Check if authorization is required
        if (data.requiresAuth) {
          setProcessingStep("Redirecting to QuickBooks authorization...");
          setResult({
            success: false,
            message: "🔐 QuickBooks authorization required. Redirecting...",
            details: data,
          });

          // Auto-redirect to OAuth
          setTimeout(() => {
            window.location.href = "/api/payments/oauth-connect";
          }, 2000);
          return; // Don't set isProcessing to false
        } else {
          setResult({
            success: false,
            message: data.error || "Payment failed",
            details: data,
          });
          onPaymentError?.(data.error || "Payment failed");
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      setResult({
        success: false,
        message: "Network error occurred during payment processing",
      });
      onPaymentError?.("Network error occurred");
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  const handlePayment = () => {
    processPayment();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Unified Payment System
        </CardTitle>
        <CardDescription>
          One API handles everything: validation, OAuth, token refresh, and
          payment processing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                handleInputChange(
                  "amount",
                  Number.parseFloat(e.target.value) || 0
                )
              }
              disabled={isProcessing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              value={formData.currency}
              onChange={(e) => handleInputChange("currency", e.target.value)}
              disabled={isProcessing}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            disabled={isProcessing}
          />
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) =>
                handleInputChange("customerName", e.target.value)
              }
              disabled={isProcessing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerEmail">Customer Email</Label>
            <Input
              id="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={(e) =>
                handleInputChange("customerEmail", e.target.value)
              }
              disabled={isProcessing}
            />
          </div>
        </div>

        {/* Card Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Card Information</h3>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={formData.cardData.number}
              onChange={(e) =>
                handleInputChange("cardData.number", e.target.value)
              }
              disabled={isProcessing}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expMonth">Month</Label>
              <Input
                id="expMonth"
                placeholder="MM"
                maxLength={2}
                value={formData.cardData.expMonth}
                onChange={(e) =>
                  handleInputChange("cardData.expMonth", e.target.value)
                }
                disabled={isProcessing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expYear">Year</Label>
              <Input
                id="expYear"
                placeholder="YY"
                maxLength={2}
                value={formData.cardData.expYear}
                onChange={(e) =>
                  handleInputChange("cardData.expYear", e.target.value)
                }
                disabled={isProcessing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="123"
                maxLength={4}
                value={formData.cardData.cvc}
                onChange={(e) =>
                  handleInputChange("cardData.cvc", e.target.value)
                }
                disabled={isProcessing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input
              id="cardName"
              value={formData.cardData.name}
              onChange={(e) =>
                handleInputChange("cardData.name", e.target.value)
              }
              disabled={isProcessing}
            />
          </div>
        </div>

        {/* Billing Address */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Billing Address</h3>

          <div className="space-y-2">
            <Label htmlFor="streetAddress">Street Address</Label>
            <Input
              id="streetAddress"
              value={formData.cardData.address.streetAddress}
              onChange={(e) =>
                handleAddressChange("streetAddress", e.target.value)
              }
              disabled={isProcessing}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.cardData.address.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                disabled={isProcessing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">State/Region</Label>
              <Input
                id="region"
                value={formData.cardData.address.region}
                onChange={(e) => handleAddressChange("region", e.target.value)}
                disabled={isProcessing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={formData.cardData.address.postalCode}
                onChange={(e) =>
                  handleAddressChange("postalCode", e.target.value)
                }
                disabled={isProcessing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.cardData.address.country}
                onChange={(e) => handleAddressChange("country", e.target.value)}
                disabled={isProcessing}
              />
            </div>
          </div>
        </div>

        {/* Processing Status */}
        {isProcessing && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>{processingStep}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              {result.message}
              {result.details && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm">
                    View Details
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Single Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {processingStep || "Processing..."}
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay ${formData.amount.toFixed(2)}
            </>
          )}
        </Button>

        {/* API Architecture Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">
            🚀 Unified API Architecture
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>
              • <strong>One main endpoint:</strong> /api/payments/process
            </li>
            <li>
              • <strong>Handles everything:</strong> validation, auth check,
              token refresh, payment
            </li>
            <li>
              • <strong>OAuth callback:</strong> /api/payments/oauth-callback
              (required by QuickBooks)
            </li>
            <li>
              • <strong>Auto-redirect:</strong> Seamless OAuth flow with
              auto-processing
            </li>
            <li>
              • <strong>Smart tokens:</strong> Automatic refresh and management
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
