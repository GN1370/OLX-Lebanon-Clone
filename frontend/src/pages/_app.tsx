import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import '@/styles/globals.css'
import { dictionaries, dirFor, isLang, Lang } from '@/i18n'
import { LanguageToggle } from '@/components/LanguageToggle/LanguageToggle'
import styles from '@/styles/AppShell.module.css'
import { Translations } from '@/i18n/types'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const lang: Lang = isLang(String(router.query.lang ?? 'en')) ? (router.query.lang as Lang) : 'en'
  const dir = dirFor(lang)
  const t = dictionaries[lang] as Translations

  return (
    <div lang={lang} dir={dir} className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>OLX</div>
        <LanguageToggle />
      </header>

      <main className={styles.main}>
        <Component {...pageProps} lang={lang} t={t} />
      </main>
    </div>
  )
}
