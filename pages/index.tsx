import type { GetServerSideProps } from "next"
import Head from "next/head"
import Header from "../components/Header"
import CategoryGrid from "../components/CategoryGrid"
import AdSection from "../components/AdSection"
import Footer from "../components/Footer"
import type { Category, Ad } from "../types"
import styles from "../styles/Home.module.css"

interface HomeProps {
  categories: Category[]
  adsByCategory: {
    categoryId: number
    categoryName: string
    ads: Ad[]
  }[]
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    // Fetch all categories
    const categoriesRes = await fetch("https://www.olx.com.lb/api/categories/source/all.json", {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; OLX-Clone/1.0)",
        Accept: "application/json",
      },
    })
    const categoriesData = await categoriesRes.json()

    // Extract main categories from the API response
    const allCategories: Category[] = categoriesData.data || []

    // Get top-level categories (those without parent or with specific structure)
    let mainCategories = allCategories.filter((cat: Category) => !cat.parent_id || cat.parent_id === 0).slice(0, 12)

    // Fallback to static categories if no main categories found
    if (mainCategories.length === 0) {
      mainCategories = getStaticCategories()
    }

    // Define featured category IDs for home page sections
    // Based on OLX Lebanon structure: Cars (378), Properties (4174), Mobile Phones (387)
    const featuredCategoryIds = [
      { id: 378, name: "Cars for Sale" },
      { id: 4174, name: "Properties for Sale" },
      { id: 387, name: "Mobile Phones" },
    ]

    // Fetch ads for each featured category
    const adsByCategory = await Promise.all(
      featuredCategoryIds.map(async (cat) => {
        try {
          const adsRes = await fetch(`https://www.olx.com.lb/api/relevance/v4/search?category=${cat.id}&limit=4`, {
            headers: {
              "User-Agent": "Mozilla/5.0 (compatible; OLX-Clone/1.0)",
              Accept: "application/json",
            },
          })
          const adsData = await adsRes.json()
          const ads = adsData.data || []
          // If no ads from API, use fallback
          if (ads.length === 0) {
            const fallbackAds = getStaticAds().find(section => section.categoryId === cat.id)?.ads || []
            return {
              categoryId: cat.id,
              categoryName: cat.name,
              ads: fallbackAds,
            }
          }
          return {
            categoryId: cat.id,
            categoryName: cat.name,
            ads,
          }
        } catch {
          // Return fallback ads if API fails
          const fallbackAds = getStaticAds().find(section => section.categoryId === cat.id)?.ads || []
          return {
            categoryId: cat.id,
            categoryName: cat.name,
            ads: fallbackAds,
          }
        }
      }),
    )

    return {
      props: {
        categories: mainCategories,
        adsByCategory,
      },
    }
  } catch (error) {
    console.error("Error fetching data:", error)
    // Return fallback static data
    return {
      props: {
        categories: getStaticCategories(),
        adsByCategory: getStaticAds(),
      },
    }
  }
}

// Fallback static categories
function getStaticCategories(): Category[] {
  return [
    { id: 378, name: "Vehicles", slug: "vehicles", icon: "car" },
    { id: 4174, name: "Properties", slug: "properties", icon: "home" },
    { id: 387, name: "Mobiles & Accessories", slug: "mobiles", icon: "phone" },
    { id: 388, name: "Electronics & Appliances", slug: "electronics", icon: "laptop" },
    { id: 389, name: "Furniture & Decor", slug: "furniture", icon: "sofa" },
    { id: 390, name: "Kids & Babies", slug: "kids", icon: "baby" },
    { id: 391, name: "Sports & Equipment", slug: "sports", icon: "sports" },
    { id: 392, name: "Hobbies", slug: "hobbies", icon: "hobby" },
    { id: 393, name: "Jobs", slug: "jobs", icon: "briefcase" },
    { id: 394, name: "Fashion & Beauty", slug: "fashion", icon: "shirt" },
    { id: 395, name: "Services", slug: "services", icon: "wrench" },
    { id: 396, name: "Pets", slug: "pets", icon: "pet" },
  ]
}

// Fallback static ads
function getStaticAds() {
  return [
    {
      categoryId: 378,
      categoryName: "Cars for Sale",
      ads: [
        {
          id: "1",
          title: "Mercedes-Benz E-Class 400 2018 AMG",
          price: { value: 48000, currency: "USD" },
          location: "Downtown, Beirut",
          image: "/mercedes-e-class-silver-luxury-car.jpg",
          date: "1 week ago",
          attributes: { mileage: "31000 km", year: "2018" },
        },
        {
          id: "2",
          title: "Porsche Cayenne 2017 Platinum Edition",
          price: { value: 27000, currency: "USD" },
          location: "Beirut Port, Beirut",
          image: "/porsche-cayenne-black-suv.jpg",
          date: "1 week ago",
          attributes: { mileage: "85000 km", year: "2017" },
        },
        {
          id: "3",
          title: "Nissan Pathfinder 2006 Company Source",
          price: { value: 6000, currency: "USD" },
          location: "Adlieh, Beirut",
          image: "/nissan-pathfinder-suv-gray.jpg",
          date: "3 days ago",
          attributes: { mileage: "120000 km", year: "2006" },
        },
        {
          id: "4",
          title: "Mercedes-Benz A250 4matic 2019",
          price: { value: 31500, currency: "USD" },
          location: "Dbaye, Metn",
          image: "/mercedes-a250-white-hatchback.jpg",
          date: "4 days ago",
          attributes: { mileage: "70000 km", year: "2019" },
        },
      ],
    },
    {
      categoryId: 4174,
      categoryName: "Properties for Sale",
      ads: [
        {
          id: "5",
          title: "Luxury Apartment in Achrafieh",
          price: { value: 350000, currency: "USD" },
          location: "Achrafieh, Beirut",
          image: "/modern-apartment-living-room-luxury.jpg",
          date: "2 days ago",
          attributes: { bedrooms: "3", area: "180 sqm" },
        },
        {
          id: "6",
          title: "Villa with Garden in Beit Mery",
          price: { value: 850000, currency: "USD" },
          location: "Beit Mery, Metn",
          image: "/villa-house-with-garden-lebanon.jpg",
          date: "5 days ago",
          attributes: { bedrooms: "5", area: "450 sqm" },
        },
        {
          id: "7",
          title: "Studio Apartment in Hamra",
          price: { value: 95000, currency: "USD" },
          location: "Hamra, Beirut",
          image: "/studio-apartment-modern-interior.jpg",
          date: "1 week ago",
          attributes: { bedrooms: "1", area: "55 sqm" },
        },
        {
          id: "8",
          title: "Duplex in Rabieh with View",
          price: { value: 520000, currency: "USD" },
          location: "Rabieh, Metn",
          image: "/duplex-apartment-mountain-view.jpg",
          date: "3 days ago",
          attributes: { bedrooms: "4", area: "280 sqm" },
        },
      ],
    },
    {
      categoryId: 387,
      categoryName: "Mobile Phones",
      ads: [
        {
          id: "9",
          title: "iPhone 15 Pro 1TB Very Clean",
          price: { value: 930, currency: "USD" },
          location: "Sin El Fil, Metn",
          image: "/iphone-15-pro-black-smartphone.jpg",
          date: "1 day ago",
          attributes: {},
        },
        {
          id: "10",
          title: "Samsung Galaxy S24 Ultra 512GB",
          price: { value: 1100, currency: "USD" },
          location: "Jal El Dib, Metn",
          image: "/samsung-galaxy-s24-ultra-phone.jpg",
          date: "2 days ago",
          attributes: {},
        },
        {
          id: "11",
          title: "iPhone 14 Pro 256GB Black",
          price: { value: 680, currency: "USD" },
          location: "Downtown, Beirut",
          image: "/iphone-14-pro-black.jpg",
          date: "4 days ago",
          attributes: {},
        },
        {
          id: "12",
          title: "Google Pixel 8 Pro 128GB",
          price: { value: 550, currency: "USD" },
          location: "Verdun, Beirut",
          image: "/google-pixel-8-pro-smartphone.jpg",
          date: "1 week ago",
          attributes: {},
        },
      ],
    },
  ]
}

export default function Home({ categories, adsByCategory }: HomeProps) {
  return (
    <>
      <Head>
        <title>OLX Lebanon - Buy & Sell Everything</title>
        <meta name="description" content="Find great deals on cars, properties, phones and more on OLX Lebanon" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Find Amazing Deals in Lebanon</h1>
            <p className={styles.heroSubtitle}>Buy and sell anything from used cars to mobile phones</p>
          </div>
        </section>

        <section className={styles.categoriesSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>All Categories</h2>
            <CategoryGrid categories={categories} />
          </div>
        </section>

        {adsByCategory.map((section) => (
          <AdSection
            key={section.categoryId}
            categoryId={section.categoryId}
            categoryName={section.categoryName}
            ads={section.ads}
          />
        ))}
      </main>

      <Footer />
    </>
  )
}
