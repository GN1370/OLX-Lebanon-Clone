import Link from 'next/link'
import { Ad } from '@/types/ad'
import { Card } from '@/components/Card/Card'
import styles from './HomePage.module.css'
import { Lang } from '@/i18n'
import { Translations } from '@/i18n/types'
import { Button } from '@/components/Button/Button'

interface Props {
  ads: Ad[]
  lang: Lang
  t: Translations
}

export const HomePage = ({ ads, lang, t }: Props) => {
  const langQuery = lang ? `?lang=${lang}` : ''

  const title = t?.home?.title ?? 'Fresh recommendations'
  const postAdLabel = t?.common?.postAd ?? 'Post Ad'

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <h1 className={styles.title}>{title}</h1>

        <Link href={`/post-ad${langQuery}`}>
          <Button type="button">{postAdLabel}</Button>
        </Link>
      </div>

      <div className={styles.grid}>
        {ads.map((ad) => (
          <Card key={ad.id} ad={ad} />
        ))}
      </div>
    </div>
  )
}
