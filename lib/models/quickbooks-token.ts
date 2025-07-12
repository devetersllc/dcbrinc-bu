export interface QuickBooksToken {
  _id?: string
  accessToken: string
  refreshToken?: string
  tokenType: string
  expiresIn: number
  expiresAt: Date
  scope: string
  companyId?: string
  companyName?: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export interface QuickBooksTokenDocument extends QuickBooksToken {
  _id: string
}
