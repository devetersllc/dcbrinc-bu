export interface Order {
  _id?: string
  userId: string
  userEmail: string
  userName: string
  name: string
  email: string
  pdfCloudinaryUrl: string
  coverCloudinaryUrl: string

  // Start Page Data
  productType: string
  goal: string
  photoBookDetails: {
    title: string
    description: string
    category: string
  }

  // Copyright Data
  bookMetadata: {
    title: string
    subtitle?: string
    author: string
    description: string
    language: string
    publicationDate: string
  }
  contributors: Array<{
    name: string
    role: string
    biography?: string
  }>
  isbn: {
    type: string
    number?: string
  }

  // Design Data
  bookSpecifications: {
    size: string
    paperType: string
    binding: string
    pageCount: number
  }
  interiorFiles: Array<{
    name: string
    url: string
    type: string
  }>
  coverDesign: {
    type: string
    frontCover?: string
    backCover?: string
    spine?: string
  }
  bookSize: string
  interiorColor: string
  bindingType: string
  coverFinish: string

  // Details Data
  projectDetails: {
    title: string
    subtitle?: string
    description: string
    edition?: string
  }
  audience: {
    ageRange: string
    targetMarket: string
  }
  categories: string[]
  keywords: string[]

  // Pricing Data
  retailPrice: {
    printPrice: number
    ebookPrice?: number
    currency: string
  }
  paymentInfo: {
    method: string
    details: any
  }
  totalPrice: number

  // Order Status
  status: "pending" | "processing" | "completed" | "cancelled"
  orderDate: Date
  totalAmount: number
}
