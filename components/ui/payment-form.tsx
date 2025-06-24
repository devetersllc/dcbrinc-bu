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
import { Separator } from "@/components/ui/separator";
import { CreditCard, Lock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CardValidator } from "@/lib/quickbooks";

interface PaymentFormProps {
  amount: number;
  currency: string;
  description: string;
  customerName: string;
  customerEmail: string;
  orderId: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
  isProcessing: boolean;
}

export function PaymentForm({
  amount,
  currency,
  description,
  customerName,
  customerEmail,
  orderId,
  onPaymentSuccess,
  onPaymentError,
  isProcessing,
}: PaymentFormProps) {
  const [cardData, setCardData] = useState({
    number: "",
    expMonth: "",
    expYear: "",
    cvc: "",
    name: customerName,
    address: {
      streetAddress: "",
      city: "",
      region: "",
      country: "US",
      postalCode: "",
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cardType, setCardType] = useState<string>("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate card number
    const cardValidation = CardValidator.validateCardNumber(cardData.number);
    if (!cardValidation.isValid) {
      newErrors.number = cardValidation.error || "Invalid card number";
    }

    // Validate expiry
    const expiryValidation = CardValidator.validateExpiry(
      cardData.expMonth,
      cardData.expYear
    );
    if (!expiryValidation.isValid) {
      newErrors.expiry = expiryValidation.error || "Invalid expiry date";
    }

    // Validate CVC
    const cvcValidation = CardValidator.validateCVC(
      cardData.cvc,
      cardData.number
    );
    if (!cvcValidation.isValid) {
      newErrors.cvc = cvcValidation.error || "Invalid CVC";
    }

    // Validate name
    const nameValidation = CardValidator.validateName(cardData.name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error || "Invalid cardholder name";
    }

    // Validate address
    const addressValidation = CardValidator.validateAddress(cardData.address);
    if (!addressValidation.isValid) {
      newErrors.address = addressValidation.error || "Invalid address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const paymentRequest = {
        amount,
        currency,
        description,
        customerName,
        customerEmail,
        orderId,
        cardData,
      };

      const response = await fetch("/api/payments/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentRequest),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onPaymentSuccess(result);
      } else {
        onPaymentError(result.error || "Payment processing failed");
      }
    } catch (error) {
      onPaymentError("Network error occurred. Please try again.");
    }
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
    const formattedValue = formatCardNumber(value);
    setCardData((prev) => ({ ...prev, number: formattedValue }));
    setCardType(CardValidator.getCardType(formattedValue));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Information
        </CardTitle>
        <CardDescription>
          Complete your book order with secure payment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Amount:</span>
            <span className="text-lg font-bold">
              ${amount.toFixed(2)} {currency}
            </span>
          </div>
          <div className="text-sm text-gray-600 mt-1">{description}</div>
        </div>

        {/* Test Card Information */}
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Test Cards:</strong>
            <br />
            Success: 4111 1111 1111 1111
            <br />
            Declined: 4000 0000 0000 0002
            <br />
            Insufficient Funds: 4000 0000 0000 0127
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardData.number}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                maxLength={19}
                className={errors.number ? "border-red-500" : ""}
              />
              {cardType && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                  {cardType}
                </div>
              )}
            </div>
            {errors.number && (
              <p className="text-sm text-red-500">{errors.number}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-2">
              <Label htmlFor="expMonth">Month</Label>
              <Input
                id="expMonth"
                placeholder="MM"
                value={cardData.expMonth}
                onChange={(e) =>
                  setCardData((prev) => ({
                    ...prev,
                    expMonth: e.target.value.replace(/\D/g, "").slice(0, 2),
                  }))
                }
                maxLength={2}
                className={errors.expiry ? "border-red-500" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expYear">Year</Label>
              <Input
                id="expYear"
                placeholder="YY"
                value={cardData.expYear}
                onChange={(e) =>
                  setCardData((prev) => ({
                    ...prev,
                    expYear: e.target.value.replace(/\D/g, "").slice(0, 2),
                  }))
                }
                maxLength={2}
                className={errors.expiry ? "border-red-500" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="123"
                value={cardData.cvc}
                onChange={(e) =>
                  setCardData((prev) => ({
                    ...prev,
                    cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
                  }))
                }
                maxLength={4}
                className={errors.cvc ? "border-red-500" : ""}
              />
            </div>
          </div>
          {errors.expiry && (
            <p className="text-sm text-red-500">{errors.expiry}</p>
          )}
          {errors.cvc && <p className="text-sm text-red-500">{errors.cvc}</p>}

          <div className="space-y-2">
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input
              id="cardName"
              placeholder="John Doe"
              value={cardData.name}
              onChange={(e) =>
                setCardData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Billing Address</h4>

            <div className="space-y-2">
              <Label htmlFor="streetAddress">Street Address</Label>
              <Input
                id="streetAddress"
                placeholder="123 Main St"
                value={cardData.address.streetAddress}
                onChange={(e) =>
                  setCardData((prev) => ({
                    ...prev,
                    address: { ...prev.address, streetAddress: e.target.value },
                  }))
                }
                className={errors.address ? "border-red-500" : ""}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="New York"
                  value={cardData.address.city}
                  onChange={(e) =>
                    setCardData((prev) => ({
                      ...prev,
                      address: { ...prev.address, city: e.target.value },
                    }))
                  }
                  className={errors.address ? "border-red-500" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">State</Label>
                <Input
                  id="region"
                  placeholder="NY"
                  value={cardData.address.region}
                  onChange={(e) =>
                    setCardData((prev) => ({
                      ...prev,
                      address: { ...prev.address, region: e.target.value },
                    }))
                  }
                  className={errors.address ? "border-red-500" : ""}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                placeholder="10001"
                value={cardData.address.postalCode}
                onChange={(e) =>
                  setCardData((prev) => ({
                    ...prev,
                    address: { ...prev.address, postalCode: e.target.value },
                  }))
                }
                className={errors.address ? "border-red-500" : ""}
              />
            </div>
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription>
              Your payment information is secure and encrypted.
            </AlertDescription>
          </Alert>

          <Button
            type="submit"
            className="w-full"
            disabled={isProcessing}
            size="lg"
          >
            {isProcessing
              ? "Processing Payment..."
              : `Pay $${amount.toFixed(2)}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
