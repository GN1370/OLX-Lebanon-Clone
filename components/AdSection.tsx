import Link from "next/link"
import AdCard from "./AdCard"
import type { Ad } from "../types"
import styles from "./AdSection.module.css"

interface AdSectionProps {
  categoryId: number
  categoryName: string
  ads: Ad[]
}

export default function AdSection({ categoryId, categoryName, ads }: AdSectionProps) {
  if (ads.length === 0) return null

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{categoryName}</h2>
          <Link href={`/category/${categoryId}`} className={styles.viewMore}>
            View more
            <ChevronRightIcon />
          </Link>
        </div>
        <div className={styles.grid}>
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}
