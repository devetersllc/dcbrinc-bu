"use client";

import type React from "react";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CreditCard, Lock } from "lucide-react";

interface PaymentFormProps {
  amount: number;
  currency?: string;
  description?: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
  customerName?: string;
  customerEmail?: string;
  cardNumber?: string;
  expMonth?: string;
  expYear?: string;
  cvc?: string;
  cardholderName?: string;
  streetAddress?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  orderId?: string;
  onPaymentSuccess?: (paymentId: string) => void;
  onPaymentError?: (error: string) => void;
  isProcessing?: boolean;
  error?: string | null;
  setShowPaymentDialog?: any;
}

export function PaymentForm({
  amount,
  currency = "USD",
  description = "Payment",
  onSuccess,
  onError,
  setShowPaymentDialog,
}: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvc: "",
    cardholderName: "",
    streetAddress: "",
    city: "",
    region: "",
    postalCode: "",
    // customerName: "Ahmad Raza",
    // customerEmail: "ahmadrazakhalid9.0@gmail.com",
    // cardNumber: "4375840123008631",
    // expMonth: "01",
    // expYear: "30",
    // cvc: "903",
    // cardholderName: "Ahmad Raza",
    // streetAddress: "280 block 2 sector AII, Township, Lahore",
    // city: "Lahore",
    // region: "Pubjab",
    // postalCode: "54770",
    country: "US",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    if (formatted.replace(/\s/g, "").length <= 16) {
      handleInputChange("cardNumber", formatted);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const paymentData = {
        amount,
        currency,
        description,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        orderId: `order-${Date.now()}`,
        cardData: {
          number: formData.cardNumber,
          expMonth: formData.expMonth,
          expYear: formData.expYear,
          cvc: formData.cvc,
          name: formData.cardholderName,
          address: {
            streetAddress: formData.streetAddress,
            city: formData.city,
            region: formData.region,
            country: formData.country,
            postalCode: formData.postalCode,
          },
        },
      };

      const response = await fetch("/api/payments/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(`Payment successful! Transaction ID: ${result.paymentId}`);
        onSuccess?.(result.paymentId);
        setShowPaymentDialog(false);
      } else {
        setError(result.error || "Payment failed");
        onError?.(result.error || "Payment failed");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Payment processing failed";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const currentYear = new Date().getFullYear() % 100;
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Information
        </CardTitle>
        <CardDescription>
          Complete your payment of ${amount.toFixed(2)} {currency}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Full Name</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) =>
                    handleInputChange("customerName", e.target.value)
                  }
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) =>
                    handleInputChange("customerEmail", e.target.value)
                  }
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Card Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Card Information
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expMonth">Month</Label>
                  <Select
                    value={formData.expMonth}
                    onValueChange={(value) =>
                      handleInputChange("expMonth", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                        (month) => (
                          <SelectItem
                            key={month}
                            value={month.toString().padStart(2, "0")}
                          >
                            {month.toString().padStart(2, "0")}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expYear">Year</Label>
                  <Select
                    value={formData.expYear}
                    onValueChange={(value) =>
                      handleInputChange("expYear", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="YY" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem
                          key={year}
                          value={year.toString().padStart(2, "0")}
                        >
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    value={formData.cvc}
                    onChange={(e) =>
                      handleInputChange(
                        "cvc",
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  value={formData.cardholderName}
                  onChange={(e) =>
                    handleInputChange("cardholderName", e.target.value)
                  }
                  placeholder="Name on card"
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Billing Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Billing Address</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="streetAddress">Street Address</Label>
                <Input
                  id="streetAddress"
                  value={formData.streetAddress}
                  onChange={(e) =>
                    handleInputChange("streetAddress", e.target.value)
                  }
                  placeholder="123 Main St"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="New York"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">State/Region</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) =>
                      handleInputChange("region", e.target.value)
                    }
                    placeholder="NY"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) =>
                      handleInputChange("postalCode", e.target.value)
                    }
                    placeholder="10001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) =>
                      handleInputChange("country", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Pay ${amount.toFixed(2)} {currency}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
