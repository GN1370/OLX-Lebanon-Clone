import { GetServerSideProps } from 'next'
import { fetchHomeAds } from '@/services/ads.service'
import { HomePage } from '@/features/home/HomePage'
import { Ad } from '@/types/ad'
import { Lang } from '@/i18n'
import { Translations } from '@/i18n/types'

interface Props {
  ads: Ad[]
  lang: Lang
  t: Translations
}

export default function Home({ ads, lang, t }: Props) {
  return <HomePage ads={ads} lang={lang} t={t} />
}

export const getServerSideProps: GetServerSideProps<{ ads: Ad[] }> = async () => {
  const ads = await fetchHomeAds()
  return { props: { ads } }
}
