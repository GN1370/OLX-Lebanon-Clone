import { useEffect, useState } from 'react'
import styles from './PostAdPage.module.css'
import { fetchCategories } from '@/services/categories.service'
import { fetchCategoryFields } from '@/services/categoryFields.service'
import { Loader } from '@/components/Loader/Loader'
import { Button } from '@/components/Button/Button'
import { normalizeCategoryFields } from './normalizeCategoryFields'
import { NormalizedSection } from '@/types/categoryField'
import { DynamicForm } from './DynamicForm'
import { CategoryPicker } from './CategoryPicker'
import { CategoryNode } from './category.types'
import { parseCategories } from './category.utils'
import { Lang } from '@/i18n'
import { Translations } from '@/i18n/types'

export function PostAdPage({ lang, t }: { lang: Lang; t: Translations }) {
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categories, setCategories] = useState<CategoryNode[]>([])
  const [categorySlug, setCategorySlug] = useState<string>('')

  const [loadingFields, setLoadingFields] = useState(false)
  const [sections, setSections] = useState<NormalizedSection[]>([])
  const [error, setError] = useState<string>('')

  useEffect(() => {
    ;(async () => {
      try {
        setLoadingCategories(true)
        const raw = await fetchCategories()
        setCategories(parseCategories(raw))
      } catch {
        setError(t.postAd.failedCategories)
      } finally {
        setLoadingCategories(false)
      }
    })()
  }, [t.postAd.failedCategories])

  useEffect(() => {
    if (!categorySlug) {
      setSections([])
      return
    }

    ;(async () => {
      try {
        setLoadingFields(true)
        setError('')

        const raw = await fetchCategoryFields({
          categorySlugs: categorySlug,
          includeChildCategories: true,
          splitByCategoryIDs: true,
          flatChoices: true,
          groupChoicesBySection: true,
          flat: true,
        })

        setSections(normalizeCategoryFields(raw))
      } catch {
        setError(t.postAd.failedFields)
        setSections([])
      } finally {
        setLoadingFields(false)
      }
    })()
  }, [categorySlug, t.postAd.failedFields])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t.postAd.title}</h1>

      <div className={styles.panel}>
        <h2 className={styles.subtitle}>{t.postAd.chooseCategory}</h2>

        {loadingCategories ? (
          <Loader />
        ) : (
          <CategoryPicker lang={lang} t={t} categories={categories} value={categorySlug} onChange={setCategorySlug} />
        )}
      </div>

      <div className={styles.panel}>
        <h2 className={styles.subtitle}>{t.postAd.adDetails}</h2>

        {error ? <p className={styles.error}>{error}</p> : null}

        {loadingFields ? (
          <Loader />
        ) : sections.length ? (
          <DynamicForm t={t} sections={sections} />
        ) : (
          <p className={styles.muted}>{t.postAd.selectCategoryToLoad}</p>
        )}
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="secondary">
          {t.common.cancel}
        </Button>
        <Button type="button" onClick={() => alert(t.common.submissionNotRequired)}>
          {t.common.postAd}
        </Button>
      </div>
    </div>
  )
}
