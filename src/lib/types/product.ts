export type ProductCategory =
  | "Compute"
  | "Storage"
  | "Database"
  | "Analytics"
  | "AI/ML"
  | "Networking"
  | "Security"
  | "DevOps"
  | "Management"
  | "Serverless"
  | "Integration"
  | "IoT"

export interface GCPProduct {
  id: string
  name: string
  category: ProductCategory
  shortDescription: string
  description: string
  icon: string
  color: string
  bgColor: string
  useCases: string[]
  keyFeatures: string[]
  pricingExample: string
  relatedProducts: string[]
  hasDemo: boolean
  demoPath?: string
}
