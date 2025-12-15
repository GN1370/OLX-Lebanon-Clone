import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    // Fetch categories from OLX Lebanon API
    const response = await fetch("https://www.olx.com.lb/api/categories/source/all.json", {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; OLX-Clone/1.0)",
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Process and structure the categories
    const categories = processCategories(data.data || [])

    res.status(200).json({ categories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    // Return fallback categories
    res.status(200).json({ categories: getFallbackCategories() })
  }
}

interface RawCategory {
  id: number
  name: string
  slug?: string
  parent_id?: number
  order?: number
}

function processCategories(rawCategories: RawCategory[]) {
  // Build category tree
  const categoryMap = new Map<number, RawCategory & { children: RawCategory[] }>()
  const rootCategories: (RawCategory & { children: RawCategory[] })[] = []

  // First pass: create all category objects with empty children arrays
  rawCategories.forEach((cat) => {
    categoryMap.set(cat.id, { ...cat, children: [] })
  })

  // Second pass: build the tree structure
  rawCategories.forEach((cat) => {
    const category = categoryMap.get(cat.id)
    if (!category) return

    if (!cat.parent_id || cat.parent_id === 0) {
      rootCategories.push(category)
    } else {
      const parent = categoryMap.get(cat.parent_id)
      if (parent) {
        parent.children.push(category)
      }
    }
  })

  // Sort by order if available
  rootCategories.sort((a, b) => (a.order || 0) - (b.order || 0))
  rootCategories.forEach((cat) => {
    cat.children.sort((a, b) => (a.order || 0) - (b.order || 0))
  })

  return rootCategories
}

function getFallbackCategories() {
  return [
    {
      id: 370,
      name: "Vehicles",
      children: [
        { id: 378, name: "Cars for Sale" },
        { id: 379, name: "Motorcycles" },
        { id: 380, name: "Auto Accessories" },
      ],
    },
    {
      id: 371,
      name: "Properties",
      children: [
        { id: 4174, name: "Properties for Sale" },
        { id: 4175, name: "Properties for Rent" },
      ],
    },
    {
      id: 387,
      name: "Mobile Phones",
      children: [
        { id: 1454, name: "Mobile Phones" },
        { id: 1455, name: "Mobile Phone Accessories" },
      ],
    },
    {
      id: 388,
      name: "Electronics & Appliances",
      children: [
        { id: 389, name: "TVs & Video" },
        { id: 390, name: "Computers & Laptops" },
      ],
    },
  ]
}
