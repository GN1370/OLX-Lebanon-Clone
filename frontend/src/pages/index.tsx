import { GetServerSideProps } from 'next'
import { fetchHomeAds } from '@/services/ads.service'
import { HomePage } from '@/features/home/HomePage'
import { Ad } from '@/types/ad'

interface Props {
  ads: Ad[]
}

export default function Home({ ads }: Props) {
  return <HomePage ads={ads} />
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const ads = await fetchHomeAds()

  return {
    props: {
      ads,
    },
  }
}
