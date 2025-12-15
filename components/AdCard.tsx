import Image from "next/image"
import type { Ad } from "../types"
import styles from "./AdCard.module.css"

interface AdCardProps {
  ad: Ad
}

export default function AdCard({ ad }: AdCardProps) {
  const formatPrice = (price: { value: number; currency: string }) => {
    return `${price.currency} ${price.value.toLocaleString()}`
  }

  return (
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={ad.image || "/placeholder.svg?height=200&width=280&query=product"}
          alt={ad.title}
          fill
          className={styles.image}
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 25vw"
        />
        <button className={styles.favoriteButton} aria-label="Add to favorites">
          <HeartIcon />
        </button>
      </div>
      <div className={styles.content}>
        <span className={styles.price}>{formatPrice(ad.price)}</span>
        <h3 className={styles.title}>{ad.title}</h3>
        {ad.attributes && Object.keys(ad.attributes).length > 0 && (
          <div className={styles.attributes}>
            {Object.entries(ad.attributes).map(([key, value]) => (
              <span key={key} className={styles.attribute}>
                {value}
              </span>
            ))}
          </div>
        )}
        <div className={styles.meta}>
          <span className={styles.location}>{ad.location}</span>
          <span className={styles.date}>{ad.date}</span>
        </div>
      </div>
    </article>
  )
}

function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  )
}
