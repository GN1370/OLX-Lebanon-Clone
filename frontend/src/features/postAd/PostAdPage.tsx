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

export function PostAdPage() {
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
        setError('Failed to load categories')
      } finally {
        setLoadingCategories(false)
      }
    })()
  }, [])

  useEffect(() => {
    if (!categorySlug) {
      setSections([])
      return
    }

    ;(async () => {
      try {
        setLoadingFields(true)
        setError('')

        // Uses PDF endpoint + params. 
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
        setError('Failed to load category fields')
        setSections([])
      } finally {
        setLoadingFields(false)
      }
    })()
  }, [categorySlug])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Post an Ad</h1>

      <div className={styles.panel}>
        <h2 className={styles.subtitle}>Choose a category</h2>

        {loadingCategories ? (
          <Loader />
        ) : (
          <CategoryPicker categories={categories} value={categorySlug} onChange={setCategorySlug} />
        )}
      </div>

      <div className={styles.panel}>
        <h2 className={styles.subtitle}>Ad details</h2>

        {error ? <p className={styles.error}>{error}</p> : null}

        {loadingFields ? (
          <Loader />
        ) : sections.length ? (
          <DynamicForm sections={sections} />
        ) : (
          <p className={styles.muted}>Select a category to load dynamic fields.</p>
        )}
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="secondary">
          Cancel
        </Button>
        <Button type="button" onClick={() => alert('Submission is not required by the assessment.')}>
          Post Ad
        </Button>
      </div>
    </div>
  )
}
