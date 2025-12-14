import styles from './Card.module.css'
import { Ad } from '@/types/ad'

interface Props {
  ad: Ad
}

export const Card = ({ ad }: Props) => {
  return (
    <div className={styles.card}>
      <img src={ad.image} alt={ad.title} />
      <div className={styles.content}>
        <h3>{ad.title}</h3>
        <p className={styles.price}>{ad.price}</p>
        <span className={styles.location}>{ad.location}</span>
      </div>
    </div>
  )
}
