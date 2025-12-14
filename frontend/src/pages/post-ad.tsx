import { PostAdPage } from '@/features/postAd/PostAdPage'
import { Lang } from '@/i18n'
import { Translations } from '@/i18n/types'

export default function PostAd(props: { lang: Lang; t: Translations }) {
  return <PostAdPage {...props} />
}
