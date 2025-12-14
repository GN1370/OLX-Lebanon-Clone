import { Ad } from '@/types/ad'
import { Card } from '@/components/Card/Card'
import styles from './HomePage.module.css'

interface Props {
  ads: Ad[]
}

export const HomePage = ({ ads }: Props) => {
  return (
    <div className={styles.container}>
      <h1>Fresh recommendations</h1>

      <div className={styles.grid}>
        {ads.map((ad) => (
          <Card key={ad.id} ad={ad} />
        ))}
      </div>
    </div>
  )
}
