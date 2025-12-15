"use client"

import { useState, useEffect, useCallback } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import Header from "../components/Header"
import Footer from "../components/Footer"
import CategorySelector from "../components/post-ad/CategorySelector"
import DynamicForm from "../components/post-ad/DynamicForm"
import type { Category, FormField } from "../types"
import styles from "../styles/PostAd.module.css"

// Category IDs from OLX Lebanon
const PROPERTIES_FOR_SALE_ID = 4174
const CARS_FOR_SALE_ID = 378

interface PostAdState {
  step: "category" | "subcategory" | "form"
  selectedCategory: Category | null
  selectedSubcategory: Category | null
  formFields: FormField[]
  isLoadingFields: boolean
}

export default function PostAd() {
  const router = useRouter()
  const [state, setState] = useState<PostAdState>({
    step: "category",
    selectedCategory: null,
    selectedSubcategory: null,
    formFields: [],
    isLoadingFields: false,
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories")
        const data = await res.json()
        setCategories(data.categories || [])
      } catch (error) {
        console.error("Error fetching categories:", error)
        // Use fallback categories
        setCategories(getFallbackCategories())
      } finally {
        setIsLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [])

  // Fetch form fields when subcategory is selected
  const fetchFormFields = useCallback(async (categoryId: number) => {
    setState((prev) => ({ ...prev, isLoadingFields: true }))
    try {
      const res = await fetch(`/api/categories/${categoryId}/attributes`)
      const data = await res.json()
      setState((prev) => ({
        ...prev,
        formFields: data.fields || [],
        isLoadingFields: false,
        step: "form",
      }))
    } catch (error) {
      console.error("Error fetching form fields:", error)
      // Use fallback fields based on category
      const fallbackFields = getFallbackFields(categoryId)
      setState((prev) => ({
        ...prev,
        formFields: fallbackFields,
        isLoadingFields: false,
        step: "form",
      }))
    }
  }, [])

  const handleCategorySelect = (category: Category) => {
    // Check if this category has subcategories
    const hasSubcategories = category.children && category.children.length > 0

    if (hasSubcategories) {
      setState((prev) => ({
        ...prev,
        selectedCategory: category,
        step: "subcategory",
      }))
    } else {
      // No subcategories, go directly to form
      setState((prev) => ({
        ...prev,
        selectedCategory: category,
        selectedSubcategory: category,
      }))
      fetchFormFields(category.id)
    }
  }

  const handleSubcategorySelect = (subcategory: Category) => {
    setState((prev) => ({
      ...prev,
      selectedSubcategory: subcategory,
    }))
    fetchFormFields(subcategory.id)
  }

  const handleBack = () => {
    if (state.step === "form") {
      setState((prev) => ({
        ...prev,
        step: prev.selectedCategory?.children?.length ? "subcategory" : "category",
        selectedSubcategory: null,
        formFields: [],
      }))
    } else if (state.step === "subcategory") {
      setState((prev) => ({
        ...prev,
        step: "category",
        selectedCategory: null,
      }))
    }
  }

  const handleFormSubmit = async (formData: Record<string, unknown>) => {
    console.log("Form submitted:", formData)
    // In a real app, this would submit to the API
    alert("Ad submitted successfully! (Demo only)")
    router.push("/")
  }

  return (
    <>
      <Head>
        <title>Post an Ad - OLX Lebanon</title>
        <meta name="description" content="Post your ad on OLX Lebanon" />
      </Head>

      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.card}>
            {/* Progress indicator */}
            <div className={styles.progress}>
              <div className={`${styles.progressStep} ${state.step !== "category" ? styles.completed : styles.active}`}>
                <span className={styles.stepNumber}>1</span>
                <span className={styles.stepLabel}>Category</span>
              </div>
              <div className={styles.progressLine} />
              <div
                className={`${styles.progressStep} ${state.step === "form" ? styles.completed : state.step === "subcategory" ? styles.active : ""}`}
              >
                <span className={styles.stepNumber}>2</span>
                <span className={styles.stepLabel}>Subcategory</span>
              </div>
              <div className={styles.progressLine} />
              <div className={`${styles.progressStep} ${state.step === "form" ? styles.active : ""}`}>
                <span className={styles.stepNumber}>3</span>
                <span className={styles.stepLabel}>Details</span>
              </div>
            </div>

            {/* Back button */}
            {state.step !== "category" && (
              <button onClick={handleBack} className={styles.backButton}>
                <ChevronLeftIcon />
                Back
              </button>
            )}

            {/* Step content */}
            {state.step === "category" && (
              <CategorySelector
                title="Select a Category"
                categories={categories}
                isLoading={isLoadingCategories}
                onSelect={handleCategorySelect}
              />
            )}

            {state.step === "subcategory" && state.selectedCategory && (
              <CategorySelector
                title={`Select a Subcategory in ${state.selectedCategory.name}`}
                categories={state.selectedCategory.children || []}
                isLoading={false}
                onSelect={handleSubcategorySelect}
              />
            )}

            {state.step === "form" && (
              <DynamicForm
                categoryName={state.selectedSubcategory?.name || state.selectedCategory?.name || ""}
                fields={state.formFields}
                isLoading={state.isLoadingFields}
                onSubmit={handleFormSubmit}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

function ChevronLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

// Fallback categories if API fails
function getFallbackCategories(): Category[] {
  return [
    {
      id: 370,
      name: "Vehicles",
      children: [
        { id: CARS_FOR_SALE_ID, name: "Cars for Sale" },
        { id: 379, name: "Motorcycles" },
        { id: 380, name: "Auto Accessories" },
      ],
    },
    {
      id: 371,
      name: "Properties",
      children: [
        { id: PROPERTIES_FOR_SALE_ID, name: "Properties for Sale" },
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

// Fallback form fields based on category
function getFallbackFields(categoryId: number): FormField[] {
  if (categoryId === PROPERTIES_FOR_SALE_ID) {
    return getPropertiesForSaleFields()
  }
  if (categoryId === CARS_FOR_SALE_ID) {
    return getCarsForSaleFields()
  }
  return getDefaultFields()
}

function getPropertiesForSaleFields(): FormField[] {
  return [
    {
      id: "title",
      name: "title",
      label: "Ad Title",
      type: "text",
      required: true,
      placeholder: "Enter a descriptive title for your property",
    },
    {
      id: "property_type",
      name: "property_type",
      label: "Property Type",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select property type" },
        { value: "apartment", label: "Apartment" },
        { value: "villa", label: "Villa" },
        { value: "townhouse", label: "Townhouse" },
        { value: "penthouse", label: "Penthouse" },
        { value: "duplex", label: "Duplex" },
        { value: "land", label: "Land" },
        { value: "building", label: "Building" },
        { value: "office", label: "Office" },
        { value: "shop", label: "Shop" },
        { value: "warehouse", label: "Warehouse" },
      ],
    },
    {
      id: "bedrooms",
      name: "bedrooms",
      label: "Bedrooms",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select bedrooms" },
        { value: "studio", label: "Studio" },
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
        { value: "6+", label: "6+" },
      ],
    },
    {
      id: "bathrooms",
      name: "bathrooms",
      label: "Bathrooms",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select bathrooms" },
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5+", label: "5+" },
      ],
    },
    {
      id: "area",
      name: "area",
      label: "Area (sqm)",
      type: "number",
      required: true,
      placeholder: "Enter area in square meters",
    },
    {
      id: "furnished",
      name: "furnished",
      label: "Furnished",
      type: "radio",
      required: true,
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "semi", label: "Semi-Furnished" },
      ],
    },
    {
      id: "price",
      name: "price",
      label: "Price (USD)",
      type: "number",
      required: true,
      placeholder: "Enter price in USD",
    },
    {
      id: "location",
      name: "location",
      label: "Location",
      type: "select",
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
      type: "textarea",
      required: true,
      placeholder: "Describe your property in detail",
    },
    {
      id: "contact_name",
      name: "contact_name",
      label: "Contact Name",
      type: "text",
      required: true,
      placeholder: "Your name",
    },
    {
      id: "contact_phone",
      name: "contact_phone",
      label: "Phone Number",
      type: "text",
      required: true,
      placeholder: "+961 XX XXX XXX",
    },
  ]
}

function getCarsForSaleFields(): FormField[] {
  return [
    {
      id: "title",
      name: "title",
      label: "Ad Title",
      type: "text",
      required: true,
      placeholder: "e.g., Mercedes-Benz E-Class 2020",
    },
    {
      id: "make",
      name: "make",
      label: "Make",
      type: "select",
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
        { value: "chevrolet", label: "Chevrolet" },
        { value: "hyundai", label: "Hyundai" },
        { value: "kia", label: "Kia" },
        { value: "porsche", label: "Porsche" },
        { value: "land_rover", label: "Land Rover" },
        { value: "jeep", label: "Jeep" },
        { value: "volkswagen", label: "Volkswagen" },
        { value: "other", label: "Other" },
      ],
    },
    {
      id: "model",
      name: "model",
      label: "Model",
      type: "text",
      required: true,
      placeholder: "e.g., E-Class, 3 Series, A4",
    },
    {
      id: "year",
      name: "year",
      label: "Year",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select year" },
        ...Array.from({ length: 30 }, (_, i) => {
          const year = new Date().getFullYear() - i
          return { value: year.toString(), label: year.toString() }
        }),
      ],
    },
    {
      id: "mileage",
      name: "mileage",
      label: "Mileage (km)",
      type: "number",
      required: true,
      placeholder: "Enter mileage in kilometers",
    },
    {
      id: "fuel_type",
      name: "fuel_type",
      label: "Fuel Type",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select fuel type" },
        { value: "petrol", label: "Petrol" },
        { value: "diesel", label: "Diesel" },
        { value: "hybrid", label: "Hybrid" },
        { value: "electric", label: "Electric" },
        { value: "lpg", label: "LPG" },
      ],
    },
    {
      id: "transmission",
      name: "transmission",
      label: "Transmission",
      type: "radio",
      required: true,
      options: [
        { value: "automatic", label: "Automatic" },
        { value: "manual", label: "Manual" },
      ],
    },
    {
      id: "body_type",
      name: "body_type",
      label: "Body Type",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select body type" },
        { value: "sedan", label: "Sedan" },
        { value: "suv", label: "SUV" },
        { value: "hatchback", label: "Hatchback" },
        { value: "coupe", label: "Coupe" },
        { value: "convertible", label: "Convertible" },
        { value: "wagon", label: "Wagon" },
        { value: "van", label: "Van" },
        { value: "pickup", label: "Pickup" },
      ],
    },
    {
      id: "color",
      name: "color",
      label: "Exterior Color",
      type: "select",
      required: false,
      options: [
        { value: "", label: "Select color" },
        { value: "white", label: "White" },
        { value: "black", label: "Black" },
        { value: "silver", label: "Silver" },
        { value: "gray", label: "Gray" },
        { value: "blue", label: "Blue" },
        { value: "red", label: "Red" },
        { value: "brown", label: "Brown" },
        { value: "green", label: "Green" },
        { value: "other", label: "Other" },
      ],
    },
    {
      id: "price",
      name: "price",
      label: "Price (USD)",
      type: "number",
      required: true,
      placeholder: "Enter price in USD",
    },
    {
      id: "location",
      name: "location",
      label: "Location",
      type: "select",
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
      type: "textarea",
      required: true,
      placeholder: "Describe the condition, features, and any additional details",
    },
    {
      id: "contact_name",
      name: "contact_name",
      label: "Contact Name",
      type: "text",
      required: true,
      placeholder: "Your name",
    },
    {
      id: "contact_phone",
      name: "contact_phone",
      label: "Phone Number",
      type: "text",
      required: true,
      placeholder: "+961 XX XXX XXX",
    },
  ]
}

function getDefaultFields(): FormField[] {
  return [
    {
      id: "title",
      name: "title",
      label: "Ad Title",
      type: "text",
      required: true,
      placeholder: "Enter a title for your ad",
    },
    {
      id: "price",
      name: "price",
      label: "Price (USD)",
      type: "number",
      required: true,
      placeholder: "Enter price",
    },
    {
      id: "condition",
      name: "condition",
      label: "Condition",
      type: "radio",
      required: true,
      options: [
        { value: "new", label: "New" },
        { value: "used", label: "Used" },
      ],
    },
    {
      id: "location",
      name: "location",
      label: "Location",
      type: "select",
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
      type: "textarea",
      required: true,
      placeholder: "Describe your item in detail",
    },
    {
      id: "contact_name",
      name: "contact_name",
      label: "Contact Name",
      type: "text",
      required: true,
      placeholder: "Your name",
    },
    {
      id: "contact_phone",
      name: "contact_phone",
      label: "Phone Number",
      type: "text",
      required: true,
      placeholder: "+961 XX XXX XXX",
    },
  ]
}
