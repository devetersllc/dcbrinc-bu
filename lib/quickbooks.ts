export interface PaymentRequest {
  amount: number
  currency: string
  description: string
  customerName: string
  customerEmail: string
  orderId: string
  cardData: {
    number: string
    expMonth: string
    expYear: string
    cvc: string
    name: string
    address: {
      streetAddress: string
      city: string
      region: string
      country: string
      postalCode: string
    }
  }
}

export interface PaymentResponse {
  success: boolean
  paymentId?: string
  transactionId?: string
  status?: string
  error?: string
  details?: any
}

export interface QuickBooksConfig {
  clientId: string
  clientSecret: string
  environment: "production" | "sandbox"
  baseUrl: string
}

export const quickbooksConfig: QuickBooksConfig = {
  clientId: process.env.QUICKBOOKS_CLIENT_ID || "ABk4W8oUzny7ps6GOllS8ooE7q6W9surDtV9YUbIeULHxJIgIN",
  clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET || "UKTeACJSQztEH0hrdk9G25P8l21vVdSWIdnR5sRl",
  environment: "production",
  baseUrl: "https://api.intuit.com",
}

export class CardValidator {
  static validateCardNumber(cardNumber: string): {
    isValid: boolean
    error?: string
  } {
    if (!cardNumber) {
      return { isValid: false, error: "Card number is required" }
    }

    const cleanNumber = cardNumber.replace(/\s+/g, "")

    if (!cleanNumber) {
      return { isValid: false, error: "Card number is required" }
    }

    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      return {
        isValid: false,
        error: "Card number must be between 13-19 digits",
      }
    }

    if (!/^\d+$/.test(cleanNumber)) {
      return { isValid: false, error: "Card number must contain only digits" }
    }

    if (!this.luhnCheck(cleanNumber)) {
      return { isValid: false, error: "Invalid card number" }
    }

    return { isValid: true }
  }

  static validateExpiry(month: string, year: string): { isValid: boolean; error?: string } {
    if (!month || !year) {
      return { isValid: false, error: "Expiry month and year are required" }
    }

    const monthNum = Number.parseInt(month, 10)
    const yearNum = Number.parseInt(year, 10)

    if (isNaN(monthNum) || isNaN(yearNum)) {
      return { isValid: false, error: "Invalid expiry date format" }
    }

    if (monthNum < 1 || monthNum > 12) {
      return { isValid: false, error: "Invalid expiry month" }
    }

    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100
    const currentMonth = currentDate.getMonth() + 1

    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
      return { isValid: false, error: "Card has expired" }
    }

    return { isValid: true }
  }

  static validateCVC(cvc: string, cardNumber: string): { isValid: boolean; error?: string } {
    if (!cvc) {
      return { isValid: false, error: "CVC is required" }
    }

    if (!/^\d+$/.test(cvc)) {
      return { isValid: false, error: "CVC must contain only digits" }
    }

    const cleanCardNumber = cardNumber.replace(/\s+/g, "")
    const isAmex = cleanCardNumber.startsWith("34") || cleanCardNumber.startsWith("37")

    if (isAmex && cvc.length !== 4) {
      return { isValid: false, error: "American Express CVC must be 4 digits" }
    }

    if (!isAmex && cvc.length !== 3) {
      return { isValid: false, error: "CVC must be 3 digits" }
    }

    return { isValid: true }
  }

  static validateName(name: string): { isValid: boolean; error?: string } {
    if (!name || !name.trim()) {
      return { isValid: false, error: "Cardholder name is required" }
    }

    if (name.trim().length < 2) {
      return {
        isValid: false,
        error: "Cardholder name must be at least 2 characters",
      }
    }

    return { isValid: true }
  }

  static validateAddress(address: PaymentRequest["cardData"]["address"]): {
    isValid: boolean
    error?: string
  } {
    if (!address) {
      return { isValid: false, error: "Address is required" }
    }

    if (!address.streetAddress?.trim()) {
      return { isValid: false, error: "Street address is required" }
    }

    if (!address.city?.trim()) {
      return { isValid: false, error: "City is required" }
    }

    if (!address.region?.trim()) {
      return { isValid: false, error: "State/Region is required" }
    }

    if (!address.postalCode?.trim()) {
      return { isValid: false, error: "Postal code is required" }
    }

    if (!address.country?.trim()) {
      return { isValid: false, error: "Country is required" }
    }

    return { isValid: true }
  }

  private static luhnCheck(cardNumber: string): boolean {
    let sum = 0
    let alternate = false

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let n = Number.parseInt(cardNumber.charAt(i), 10)

      if (alternate) {
        n *= 2
        if (n > 9) {
          n = (n % 10) + 1
        }
      }

      sum += n
      alternate = !alternate
    }

    return sum % 10 === 0
  }

  static getCardType(cardNumber: string): string {
    const cleanNumber = cardNumber.replace(/\s+/g, "")

    if (/^4/.test(cleanNumber)) return "Visa"
    if (/^5[1-5]/.test(cleanNumber)) return "Mastercard"
    if (/^3[47]/.test(cleanNumber)) return "American Express"
    if (/^6/.test(cleanNumber)) return "Discover"

    return "Unknown"
  }
}

export class QuickBooksPaymentService {
  private config: QuickBooksConfig

  constructor(config: QuickBooksConfig) {
    this.config = config
  }

  async getStoredAccessToken(): Promise<string | null> {
    try {
      // Import here to avoid circular dependency
      const { connectToDatabase } = await import("@/lib/db")
      const db = await connectToDatabase()
      const tokensCollection = db.collection("quickbooks_tokens")

      const tokenDoc = await tokensCollection.findOne({ isActive: true }, { sort: { createdAt: -1 } })

      if (!tokenDoc) {
        return null
      }

      // Check if token is expired
      const now = new Date()
      if (tokenDoc.expiresAt < now) {
        // Try to refresh the token
        if (tokenDoc.refreshToken) {
          const refreshResult = await this.refreshAccessToken(tokenDoc.refreshToken)
          if (refreshResult) {
            // Update the token in database
            const expiresAt = new Date(Date.now() + 3600 * 1000)
            await tokensCollection.updateOne(
              { _id: tokenDoc._id },
              {
                $set: {
                  accessToken: refreshResult.accessToken,
                  refreshToken: refreshResult.refreshToken || tokenDoc.refreshToken,
                  expiresAt: expiresAt,
                  updatedAt: new Date(),
                },
              },
            )
            return refreshResult.accessToken
          }
        }

        // Mark token as inactive if refresh failed
        await tokensCollection.updateOne({ _id: tokenDoc._id }, { $set: { isActive: false, updatedAt: now } })
        return null
      }

      return tokenDoc.accessToken
    } catch (error) {
      console.error("Error getting stored access token:", error)
      return null
    }
  }

  async createPayment(paymentData: PaymentRequest, accessToken?: string): Promise<PaymentResponse> {
    try {
      console.log("Processing production payment for order:", paymentData.orderId)

      // Validate payment data
      const validation = this.validatePaymentData(paymentData)
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error || "Payment validation failed",
        }
      }

      // Check QuickBooks credentials
      if (!this.config.clientId || !this.config.clientSecret) {
        return {
          success: false,
          error: "QuickBooks credentials not configured",
          details: "Missing QUICKBOOKS_CLIENT_ID or QUICKBOOKS_CLIENT_SECRET",
        }
      }

      // Use provided access token or get stored one
      const token = accessToken || (await this.getStoredAccessToken())
      if (!token) {
        console.log("No access token available")
        return {
          success: false,
          error: "QuickBooks authorization required",
          details: "Please connect your QuickBooks account first",
          requiresAuth: true,
        }
      }

      console.log("Using access token for payment processing")

      // Prepare payment request for QuickBooks
      const quickbooksPayment = {
        amount: Number(paymentData.amount.toFixed(2)),
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
      }

      console.log("Making QuickBooks payment request...")

      // Make payment request to QuickBooks
      const response = await fetch(`https://api.intuit.com/quickbooks/v4/payments/charges`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
          "Request-Id": `${paymentData.orderId}-${Date.now()}`,
        },
        body: JSON.stringify(quickbooksPayment),
      })

      console.log("QuickBooks response status:", response.status)

      const responseText = await response.text()
      let responseData: any

      try {
        responseData = responseText ? JSON.parse(responseText) : {}
      } catch (parseError) {
        console.error("Failed to parse QuickBooks response:", responseText)
        return {
          success: false,
          error: "Invalid response from payment processor",
          details: responseText,
        }
      }

      if (!response.ok) {
        console.error("QuickBooks payment failed:", responseData)

        let errorMessage = "Payment processing failed"
        if (responseData.errors && responseData.errors.length > 0) {
          const error = responseData.errors[0]
          switch (error.code) {
            case "INVALID_CARD_NUMBER":
              errorMessage = "Invalid card number"
              break
            case "CARD_EXPIRED":
              errorMessage = "Card has expired"
              break
            case "INSUFFICIENT_FUNDS":
              errorMessage = "Insufficient funds"
              break
            case "CARD_DECLINED":
              errorMessage = "Card was declined"
              break
            case "INVALID_CVC":
              errorMessage = "Invalid security code"
              break
            case "INVALID_REQUEST":
              errorMessage = "Invalid payment request"
              break
            case "AUTHENTICATION_FAILED":
              errorMessage = "Payment authentication failed"
              break
            default:
              errorMessage = error.detail || error.message || errorMessage
          }
        }

        return {
          success: false,
          error: errorMessage,
          details: responseData,
        }
      }

      console.log("Payment processed successfully:", responseData.id)
      return {
        success: true,
        paymentId: responseData.id,
        transactionId: responseData.id,
        status: responseData.status,
        details: responseData,
      }
    } catch (error) {
      console.error("Payment processing error:", error)
      return {
        success: false,
        error: "Payment processing failed",
        details: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken?: string } | null> {
    try {
      const response = await fetch("https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString("base64")}`,
          Accept: "application/json",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      })

      if (!response.ok) {
        console.error("Token refresh failed:", await response.text())
        return null
      }

      const data = await response.json()
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      }
    } catch (error) {
      console.error("Error refreshing token:", error)
      return null
    }
  }

  private validatePaymentData(paymentData: PaymentRequest): {
    isValid: boolean
    error?: string
  } {
    if (!paymentData) {
      return { isValid: false, error: "Payment data is required" }
    }

    if (!paymentData.cardData) {
      return { isValid: false, error: "Card data is required" }
    }

    const cardValidation = CardValidator.validateCardNumber(paymentData.cardData.number)
    if (!cardValidation.isValid) {
      return cardValidation
    }

    const expiryValidation = CardValidator.validateExpiry(paymentData.cardData.expMonth, paymentData.cardData.expYear)
    if (!expiryValidation.isValid) {
      return expiryValidation
    }

    const cvcValidation = CardValidator.validateCVC(paymentData.cardData.cvc, paymentData.cardData.number)
    if (!cvcValidation.isValid) {
      return cvcValidation
    }

    const nameValidation = CardValidator.validateName(paymentData.cardData.name)
    if (!nameValidation.isValid) {
      return nameValidation
    }

    const addressValidation = CardValidator.validateAddress(paymentData.cardData.address)
    if (!addressValidation.isValid) {
      return addressValidation
    }

    if (paymentData.amount <= 0) {
      return { isValid: false, error: "Payment amount must be greater than 0" }
    }

    return { isValid: true }
  }
}
