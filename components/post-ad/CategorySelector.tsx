"use client"

import type { Category } from "../../types"
import styles from "./CategorySelector.module.css"

interface CategorySelectorProps {
  title: string
  categories: Category[]
  isLoading: boolean
  onSelect: (category: Category) => void
}

export default function CategorySelector({ title, categories, isLoading, onSelect }: CategorySelectorProps) {
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading categories...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.grid}>
        {categories.map((category) => (
          <button key={category.id} className={styles.categoryButton} onClick={() => onSelect(category)}>
            <span className={styles.categoryName}>{category.name}</span>
            {category.children && category.children.length > 0 && <ChevronRightIcon />}
          </button>
        ))}
      </div>
    </div>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}
