import { useRouter } from 'next/router'
import styles from './LanguageToggle.module.css'
import { isLang, Lang } from '@/i18n'

export function LanguageToggle() {
  const router = useRouter()
  const current = isLang(String(router.query.lang ?? 'en')) ? (router.query.lang as Lang) : 'en'

  function setLang(lang: Lang) {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, lang },
      },
      undefined,
      { shallow: false }
    )
  }

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={`${styles.btn} ${current === 'en' ? styles.active : ''}`}
        onClick={() => setLang('en')}
      >
        EN
      </button>
      <button
        type="button"
        className={`${styles.btn} ${current === 'ar' ? styles.active : ''}`}
        onClick={() => setLang('ar')}
      >
        AR
      </button>
    </div>
  )
}
