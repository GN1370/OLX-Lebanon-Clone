import type { NextApiRequest, NextApiResponse } from "next"

// Category IDs from OLX Lebanon
const PROPERTIES_FOR_SALE_ID = 4174
const CARS_FOR_SALE_ID = 378

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { categoryId } = req.query
  const catId = Number.parseInt(categoryId as string, 10)

  try {
    // Attempt to fetch attributes from OLX Lebanon API
    const response = await fetch(`https://www.olx.com.lb/api/categories/${catId}/source/attributes.json`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; OLX-Clone/1.0)",
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    const fields = processAttributes(data.data || [], catId)

    res.status(200).json({ fields })
  } catch (error) {
    console.error("Error fetching attributes:", error)
    // Return fallback fields based on category
    const fields = getFallbackFields(catId)
    res.status(200).json({ fields })
  }
}

interface RawAttribute {
  id: string
  name: string
  label?: string
  type?: string
  required?: boolean
  values?: { id: string; name: string }[]
}

function processAttributes(rawAttributes: RawAttribute[], categoryId: number) {
  // Base fields that all ads need
  const baseFields = [
    {
      id: "title",
      name: "title",
      label: "Ad Title",
      type: "text",
      required: true,
      placeholder: "Enter a descriptive title",
    },
  ]

  // Process API attributes
  const processedFields = rawAttributes.map((attr) => ({
    id: attr.id || attr.name,
    name: attr.name,
    label: attr.label || attr.name,
    type: mapAttributeType(attr.type),
    required: attr.required || false,
    options: attr.values?.map((v) => ({
      value: v.id,
      label: v.name,
    })),
  }))

  // Add base fields + category-specific fields + processed API fields + contact fields
  const categoryFields = getCategorySpecificFields(categoryId)
  const contactFields = getContactFields()

  return [...baseFields, ...categoryFields, ...processedFields, ...contactFields]
}

function mapAttributeType(apiType?: string): "text" | "select" | "number" | "textarea" | "radio" {
  switch (apiType) {
    case "list":
    case "dropdown":
      return "select"
    case "integer":
    case "float":
      return "number"
    case "boolean":
      return "radio"
    default:
      return "text"
  }
}

function getCategorySpecificFields(categoryId: number) {
  if (categoryId === PROPERTIES_FOR_SALE_ID) {
    return [
      {
        id: "property_type",
        name: "property_type",
        label: "Property Type",
        type: "select" as const,
        required: true,
        options: [
          { value: "", label: "Select property type" },
          { value: "apartment", label: "Apartment" },
          { value: "villa", label: "Villa" },
          { value: "townhouse", label: "Townhouse" },
          { value: "penthouse", label: "Penthouse" },
          { value: "duplex", label: "Duplex" },
          { value: "land", label: "Land" },
        ],
      },
      {
        id: "bedrooms",
        name: "bedrooms",
        label: "Bedrooms",
        type: "select" as const,
        required: true,
        options: [
          { value: "", label: "Select bedrooms" },
          { value: "studio", label: "Studio" },
          { value: "1", label: "1" },
          { value: "2", label: "2" },
          { value: "3", label: "3" },
          { value: "4", label: "4" },
          { value: "5+", label: "5+" },
        ],
      },
      {
        id: "bathrooms",
        name: "bathrooms",
        label: "Bathrooms",
        type: "select" as const,
        required: true,
        options: [
          { value: "", label: "Select bathrooms" },
          { value: "1", label: "1" },
          { value: "2", label: "2" },
          { value: "3", label: "3" },
          { value: "4+", label: "4+" },
        ],
      },
      {
        id: "area",
        name: "area",
        label: "Area (sqm)",
        type: "number" as const,
        required: true,
        placeholder: "Enter area in square meters",
      },
      {
        id: "furnished",
        name: "furnished",
        label: "Furnished",
        type: "radio" as const,
        required: true,
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
          { value: "semi", label: "Semi-Furnished" },
        ],
      },
    ]
  }

  if (categoryId === CARS_FOR_SALE_ID) {
    return [
      {
        id: "make",
        name: "make",
        label: "Make",
        type: "select" as const,
        required: true,
        options: [
          { value: "", label: "Select make" },
          { value: "mercedes", label: "Mercedes-Benz" },
          { value: "bmw", label: "BMW" },
          { value: "audi", label: "Audi" },
          { value: "toyota", label: "Toyota" },
          { value: "honda", label: "Honda" },
          { value: "nissan", label: "Nissan" },
          { value: "ford", label: "Ford" },
          { value: "porsche", label: "Porsche" },
          { value: "other", label: "Other" },
        ],
      },
      {
        id: "model",
        name: "model",
        label: "Model",
        type: "text" as const,
        required: true,
        placeholder: "e.g., E-Class, 3 Series",
      },
      {
        id: "year",
        name: "year",
        label: "Year",
        type: "select" as const,
        required: true,
        options: [
          { value: "", label: "Select year" },
          ...Array.from({ length: 25 }, (_, i) => {
            const year = 2024 - i
            return { value: year.toString(), label: year.toString() }
          }),
        ],
      },
      {
        id: "mileage",
        name: "mileage",
        label: "Mileage (km)",
        type: "number" as const,
        required: true,
        placeholder: "Enter mileage",
      },
      {
        id: "fuel_type",
        name: "fuel_type",
        label: "Fuel Type",
        type: "select" as const,
        required: true,
        options: [
          { value: "", label: "Select fuel type" },
          { value: "petrol", label: "Petrol" },
          { value: "diesel", label: "Diesel" },
          { value: "hybrid", label: "Hybrid" },
          { value: "electric", label: "Electric" },
        ],
      },
      {
        id: "transmission",
        name: "transmission",
        label: "Transmission",
        type: "radio" as const,
        required: true,
        options: [
          { value: "automatic", label: "Automatic" },
          { value: "manual", label: "Manual" },
        ],
      },
    ]
  }

  return []
}

function getContactFields() {
  return [
    {
      id: "price",
      name: "price",
      label: "Price (USD)",
      type: "number" as const,
      required: true,
      placeholder: "Enter price",
    },
    {
      id: "location",
      name: "location",
      label: "Location",
      type: "select" as const,
      required: true,
      options: [
        { value: "", label: "Select location" },
        { value: "beirut", label: "Beirut" },
        { value: "mount_lebanon", label: "Mount Lebanon" },
        { value: "north_lebanon", label: "North Lebanon" },
        { value: "south_lebanon", label: "South Lebanon" },
        { value: "bekaa", label: "Bekaa" },
      ],
    },
    {
      id: "description",
      name: "description",
      label: "Description",
      type: "textarea" as const,
      required: true,
      placeholder: "Describe your item in detail",
    },
    {
      id: "contact_name",
      name: "contact_name",
      label: "Contact Name",
      type: "text" as const,
      required: true,
      placeholder: "Your name",
    },
    {
      id: "contact_phone",
      name: "contact_phone",
      label: "Phone Number",
      type: "text" as const,
      required: true,
      placeholder: "+961 XX XXX XXX",
    },
  ]
}

function getFallbackFields(categoryId: number) {
  const baseFields = [
    {
      id: "title",
      name: "title",
      label: "Ad Title",
      type: "text" as const,
      required: true,
      placeholder: "Enter a descriptive title",
    },
  ]

  const categoryFields = getCategorySpecificFields(categoryId)
  const contactFields = getContactFields()

  return [...baseFields, ...categoryFields, ...contactFields]
}
