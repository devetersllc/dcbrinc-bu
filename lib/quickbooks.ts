export interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  customerName: string;
  customerEmail: string;
  orderId: string;
  cardData: {
    number: string;
    expMonth: string;
    expYear: string;
    cvc: string;
    name: string;
    address: {
      streetAddress: string;
      city: string;
      region: string;
      country: string;
      postalCode: string;
    };
  };
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  transactionId?: string;
  status?: string;
  error?: string;
  details?: string;
}

export interface QuickBooksConfig {
  clientId: string;
  clientSecret: string;
  environment: "sandbox" | "production";
  baseUrl: string;
}

export const quickbooksConfig: QuickBooksConfig = {
  clientId:
    process.env.QUICKBOOKS_CLIENT_ID ||
    "ABDRA2OcO8b4jHQefcUuQQlJUPcaOVGkR75iXjRucxhMdhtzEu",
  clientSecret:
    process.env.QUICKBOOKS_CLIENT_SECRET ||
    "pp2d4HwwyTuafN4M17EWD0ZKmYp6Dhq6AC6FrrNJ",
  environment:
    process.env.NODE_ENV === "production" ? "production" : "production",
  baseUrl:
    process.env.NODE_ENV === "production"
      ? "https://api.intuit.com"
      : "https://api.intuit.com",
  // : "https://sandbox-quickbooks.api.intuit.com",
};

// Card validation utilities
export class CardValidator {
  static validateCardNumber(cardNumber: string): {
    isValid: boolean;
    error?: string;
  } {
    const cleanNumber = cardNumber.replace(/\s+/g, "");

    // Check if empty
    if (!cleanNumber) {
      return { isValid: false, error: "Card number is required" };
    }

    // Check length
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      return {
        isValid: false,
        error: "Card number must be between 13-19 digits",
      };
    }

    // Check if all digits
    if (!/^\d+$/.test(cleanNumber)) {
      return { isValid: false, error: "Card number must contain only digits" };
    }

    // Luhn algorithm validation
    if (!this.luhnCheck(cleanNumber)) {
      return { isValid: false, error: "Invalid card number" };
    }

    return { isValid: true };
  }

  static validateExpiry(
    month: string,
    year: string
  ): { isValid: boolean; error?: string } {
    if (!month || !year) {
      return { isValid: false, error: "Expiry month and year are required" };
    }

    const monthNum = Number.parseInt(month, 10);
    const yearNum = Number.parseInt(year, 10);

    if (monthNum < 1 || monthNum > 12) {
      return { isValid: false, error: "Invalid expiry month" };
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (
      yearNum < currentYear ||
      (yearNum === currentYear && monthNum < currentMonth)
    ) {
      return { isValid: false, error: "Card has expired" };
    }

    return { isValid: true };
  }

  static validateCVC(
    cvc: string,
    cardNumber: string
  ): { isValid: boolean; error?: string } {
    if (!cvc) {
      return { isValid: false, error: "CVC is required" };
    }

    if (!/^\d+$/.test(cvc)) {
      return { isValid: false, error: "CVC must contain only digits" };
    }

    const cleanCardNumber = cardNumber.replace(/\s+/g, "");
    const isAmex =
      cleanCardNumber.startsWith("34") || cleanCardNumber.startsWith("37");

    if (isAmex && cvc.length !== 4) {
      return { isValid: false, error: "American Express CVC must be 4 digits" };
    }

    if (!isAmex && cvc.length !== 3) {
      return { isValid: false, error: "CVC must be 3 digits" };
    }

    return { isValid: true };
  }

  static validateName(name: string): { isValid: boolean; error?: string } {
    if (!name || !name.trim()) {
      return { isValid: false, error: "Cardholder name is required" };
    }

    if (name.trim().length < 2) {
      return {
        isValid: false,
        error: "Cardholder name must be at least 2 characters",
      };
    }

    return { isValid: true };
  }

  static validateAddress(address: PaymentRequest["cardData"]["address"]): {
    isValid: boolean;
    error?: string;
  } {
    if (!address.streetAddress?.trim()) {
      return { isValid: false, error: "Street address is required" };
    }

    if (!address.city?.trim()) {
      return { isValid: false, error: "City is required" };
    }

    if (!address.region?.trim()) {
      return { isValid: false, error: "State/Region is required" };
    }

    if (!address.postalCode?.trim()) {
      return { isValid: false, error: "Postal code is required" };
    }

    // US postal code validation
    if (
      address.country === "US" &&
      !/^\d{5}(-\d{4})?$/.test(address.postalCode)
    ) {
      return { isValid: false, error: "Invalid US postal code format" };
    }

    return { isValid: true };
  }

  private static luhnCheck(cardNumber: string): boolean {
    let sum = 0;
    let alternate = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let n = Number.parseInt(cardNumber.charAt(i), 10);

      if (alternate) {
        n *= 2;
        if (n > 9) {
          n = (n % 10) + 1;
        }
      }

      sum += n;
      alternate = !alternate;
    }

    return sum % 10 === 0;
  }

  static getCardType(cardNumber: string): string {
    const cleanNumber = cardNumber.replace(/\s+/g, "");

    if (/^4/.test(cleanNumber)) return "Visa";
    if (/^5[1-5]/.test(cleanNumber)) return "Mastercard";
    if (/^3[47]/.test(cleanNumber)) return "American Express";
    if (/^6/.test(cleanNumber)) return "Discover";

    return "Unknown";
  }
}

// Mock payment processor for testing
export class MockPaymentProcessor {
  static async processPayment(
    paymentData: PaymentRequest
  ): Promise<PaymentResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Validate all card data
    const cardValidation = this.validatePaymentData(paymentData);
    if (!cardValidation.isValid) {
      return {
        success: false,
        error: cardValidation.error,
        details: "Payment validation failed",
      };
    }

    // Test card numbers for different scenarios
    const cleanCardNumber = paymentData.cardData.number.replace(/\s+/g, "");

    // Simulate different payment outcomes based on card number
    if (cleanCardNumber === "4000000000000002") {
      return {
        success: false,
        error: "Card declined",
        details:
          "Your card was declined. Please try a different payment method.",
      };
    }

    if (cleanCardNumber === "4000000000000119") {
      return {
        success: false,
        error: "Processing error",
        details: "A processing error occurred. Please try again.",
      };
    }

    if (cleanCardNumber === "4000000000000127") {
      return {
        success: false,
        error: "Insufficient funds",
        details: "Your card has insufficient funds for this transaction.",
      };
    }

    // Simulate random failures (5% chance)
    if (Math.random() < 0.05) {
      return {
        success: false,
        error: "Network error",
        details: "A network error occurred. Please try again.",
      };
    }

    // Success case
    return {
      success: true,
      paymentId: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      transactionId: `txn_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      status: "completed",
    };
  }

  private static validatePaymentData(paymentData: PaymentRequest): {
    isValid: boolean;
    error?: string;
  } {
    // Validate card number
    const cardValidation = CardValidator.validateCardNumber(
      paymentData.cardData.number
    );
    if (!cardValidation.isValid) {
      return cardValidation;
    }

    // Validate expiry
    const expiryValidation = CardValidator.validateExpiry(
      paymentData.cardData.expMonth,
      paymentData.cardData.expYear
    );
    if (!expiryValidation.isValid) {
      return expiryValidation;
    }

    // Validate CVC
    const cvcValidation = CardValidator.validateCVC(
      paymentData.cardData.cvc,
      paymentData.cardData.number
    );
    if (!cvcValidation.isValid) {
      return cvcValidation;
    }

    // Validate name
    const nameValidation = CardValidator.validateName(
      paymentData.cardData.name
    );
    if (!nameValidation.isValid) {
      return nameValidation;
    }

    // Validate address
    const addressValidation = CardValidator.validateAddress(
      paymentData.cardData.address
    );
    if (!addressValidation.isValid) {
      return addressValidation;
    }

    // Validate amount
    if (paymentData.amount <= 0) {
      return { isValid: false, error: "Payment amount must be greater than 0" };
    }

    if (paymentData.amount > 10000) {
      return { isValid: false, error: "Payment amount exceeds maximum limit" };
    }

    return { isValid: true };
  }
}

export class QuickBooksPaymentService {
  private config: QuickBooksConfig;
  private accessToken: string | null = null;

  constructor(config: QuickBooksConfig) {
    this.config = config;
  }

  async createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      console.log("Processing payment for order:", paymentData.orderId);

      // Validate payment data first
      const validation = this.validatePaymentData(paymentData);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error || "Payment validation failed",
        };
      }
      // Check if QuickBooks credentials are configured
      if (!this.config.clientId || !this.config.clientSecret) {
        console.error("QuickBooks credentials not configured");
        return {
          success: false,
          error: "Payment system not configured",
          details: "QuickBooks credentials are missing",
        };
      }
      // Get access token
      const accessToken = await this.getAccessToken();
      // Prepare payment request for QuickBooks
      const quickbooksPayment = {
        amount: paymentData.amount.toFixed(2),
        currency: paymentData.currency,
        card: {
          number: paymentData.cardData.number.replace(/\s+/g, ""),
          expMonth: paymentData.cardData.expMonth.padStart(2, "0"),
          expYear: `20${paymentData.cardData.expYear}`,
          cvc: paymentData.cardData.cvc,
          name: paymentData.cardData.name,
          address: {
            streetAddress: paymentData.cardData.address.streetAddress,
            city: paymentData.cardData.address.city,
            region: paymentData.cardData.address.region,
            country: paymentData.cardData.address.country,
            postalCode: paymentData.cardData.address.postalCode,
          },
        },
        context: {
          mobile: false,
          isEcommerce: true,
        },
      };
      // Make payment request to QuickBooks
      const response = await fetch(
        `${this.config.baseUrl}/quickbooks/v4/payments/charges`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
            "Request-Id": `${paymentData.orderId}-${Date.now()}`,
          },
          body: JSON.stringify(quickbooksPayment),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        console.error("QuickBooks payment failed:", responseData);
        // Handle specific QuickBooks error codes
        let errorMessage = "Payment processing failed";
        if (responseData.errors && responseData.errors.length > 0) {
          const error = responseData.errors[0];
          switch (error.code) {
            case "INVALID_CARD_NUMBER":
              errorMessage = "Invalid card number";
              break;
            case "CARD_EXPIRED":
              errorMessage = "Card has expired";
              break;
            case "INSUFFICIENT_FUNDS":
              errorMessage = "Insufficient funds";
              break;
            case "CARD_DECLINED":
              errorMessage = "Card was declined";
              break;
            case "INVALID_CVC":
              errorMessage = "Invalid security code";
              break;
            default:
              errorMessage = error.detail || errorMessage;
          }
        }
        return {
          success: false,
          error: errorMessage,
          details: responseData,
        };
      }
      // Payment successful
      console.log("Payment processed successfully:", responseData.id);
      return {
        success: true,
        paymentId: responseData.id,
        transactionId: responseData.id,
        status: responseData.status,
        details: responseData,
      };
    } catch (error) {
      console.error("Payment processing error:", error);
      return {
        success: false,
        error: "Payment processing failed",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    try {
      const response = await fetch(
        "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(
              `${this.config.clientId}:${this.config.clientSecret}`
            ).toString("base64")}`,
            Accept: "application/json",
          },
          body: new URLSearchParams({
            grant_type: "client_credentials",
            scope: "com.intuit.quickbooks.payment",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("QuickBooks auth error:", errorData);
        throw new Error(`Failed to get access token: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      // Set token expiration (QuickBooks tokens typically expire in 1 hour)
      setTimeout(() => {
        this.accessToken = null;
      }, (data.expires_in - 60) * 1000); // Refresh 1 minute before expiry
      return this.accessToken as string;
    } catch (error) {
      console.error("Error getting QuickBooks access token:", error);
      throw new Error("Failed to authenticate with QuickBooks");
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(
        `${this.config.baseUrl}/quickbooks/v4/payments/charges/${paymentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: "Failed to get payment status",
          details: responseData,
        };
      }

      return {
        success: true,
        paymentId: responseData.id,
        status: responseData.status,
        details: responseData,
      };
    } catch (error) {
      console.error("Error getting payment status:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get payment status",
      };
    }
  }
  private validatePaymentData(paymentData: PaymentRequest): {
    isValid: boolean;
    error?: string;
  } {
    // Validate card number
    const cardValidation = CardValidator.validateCardNumber(
      paymentData.cardData.number
    );
    if (!cardValidation.isValid) {
      return cardValidation;
    }
    // Validate expiry
    const expiryValidation = CardValidator.validateExpiry(
      paymentData.cardData.expMonth,
      paymentData.cardData.expYear
    );
    if (!expiryValidation.isValid) {
      return expiryValidation;
    }
    // Validate CVC
    const cvcValidation = CardValidator.validateCVC(
      paymentData.cardData.cvc,
      paymentData.cardData.number
    );
    if (!cvcValidation.isValid) {
      return cvcValidation;
    }
    // Validate name
    const nameValidation = CardValidator.validateName(
      paymentData.cardData.name
    );
    if (!nameValidation.isValid) {
      return nameValidation;
    }
    // Validate address
    const addressValidation = CardValidator.validateAddress(
      paymentData.cardData.address
    );
    if (!addressValidation.isValid) {
      return addressValidation;
    }
    // Validate amount
    if (paymentData.amount <= 0) {
      return { isValid: false, error: "Payment amount must be greater than 0" };
    }
    if (paymentData.amount > 10000) {
      return { isValid: false, error: "Payment amount exceeds maximum limit" };
    }
    return { isValid: true };
  }
}
