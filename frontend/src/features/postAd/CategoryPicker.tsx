import { useMemo, useState, useEffect } from 'react'
import styles from './CategoryPicker.module.css'
import { CategoryNode } from './category.types'
import { findNodeBySlug, findPathBySlug, toOptions } from './category.utils'
import { Select } from '@/components/Select/Select'
import { Button } from '@/components/Button/Button'

type Props = {
  categories: CategoryNode[]
  value: string
  onChange: (slug: string) => void
}

const REQUIRED_SUGGESTIONS = [
  { slug: 'properties-for-sale', label: 'Properties for Sale' },
  { slug: 'cars-for-sale', label: 'Cars for Sale' },
] as const

export function CategoryPicker({ categories, value, onChange }: Props) {
  const [parentSlug, setParentSlug] = useState('')
  const [childSlug, setChildSlug] = useState('')

  const topOptions = useMemo(() => toOptions(categories), [categories])

  const selectedParent = useMemo(
    () => (parentSlug ? findNodeBySlug(categories, parentSlug) : null),
    [categories, parentSlug]
  )

  const childOptions = useMemo(() => {
    const children = selectedParent?.children ?? []
    return toOptions(children)
  }, [selectedParent])

  // If a value is externally set (e.g., suggested buttons), sync parent/child selects.
  useEffect(() => {
    if (!value) return
    const path = findPathBySlug(categories, value)
    if (path.length === 1) {
      setParentSlug(path[0].slug)
      setChildSlug('')
    } else if (path.length >= 2) {
      setParentSlug(path[0].slug)
      setChildSlug(path[path.length - 1].slug)
    }
  }, [categories, value])

  // Commit selection:
  // - If child selected -> use child slug
  // - Else -> use parent slug
  useEffect(() => {
    const slug = childSlug || parentSlug
    if (slug !== value) onChange(slug)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentSlug, childSlug])

  const breadcrumb = useMemo(() => {
    if (!value) return ''
    const path = findPathBySlug(categories, value)
    return path.map((p) => p.name).join(' / ')
  }, [categories, value])

  return (
    <div className={styles.wrap}>
      <div className={styles.suggestions}>
        <span className={styles.suggestLabel}>Required categories (quick select):</span>
        <div className={styles.suggestButtons}>
          {REQUIRED_SUGGESTIONS.map((s) => (
            <Button key={s.slug} type="button" variant="secondary" onClick={() => onChange(s.slug)}>
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        <Select
          label="Main category"
          value={parentSlug}
          options={topOptions}
          onChange={(slug) => {
            setParentSlug(slug)
            setChildSlug('')
          }}
        />

        <Select
          label="Sub category (optional)"
          value={childSlug}
          options={childOptions}
          placeholder={selectedParent?.children?.length ? 'Select…' : 'No subcategories'}
          disabled={!selectedParent?.children?.length}
          onChange={(slug) => setChildSlug(slug)}
        />
      </div>

      {breadcrumb ? <p className={styles.breadcrumb}>{breadcrumb}</p> : null}
    </div>
  )
}
