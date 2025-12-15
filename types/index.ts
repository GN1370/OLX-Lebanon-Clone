export interface Category {
  id: number
  name: string
  slug?: string
  icon?: string
  parent_id?: number
  children?: Category[]
}

export interface Ad {
  id: string
  title: string
  price: {
    value: number
    currency: string
  }
  location: string
  image?: string
  date: string
  attributes?: Record<string, string>
}

export interface CategoryAttribute {
  id: string
  name: string
  label: string
  type: "select" | "text" | "number" | "textarea"
  required: boolean
  options?: { value: string; label: string }[]
  placeholder?: string
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

export interface FormField {
  id: string
  name: string
  label: string
  type: "select" | "text" | "number" | "textarea" | "radio"
  required: boolean
  options?: { value: string; label: string }[]
  placeholder?: string
  dependsOn?: {
    field: string
    value: string
  }
}
