"use client"

import type React from "react"

import { useState, useCallback } from "react"
import type { FormField } from "../../types"
import styles from "./DynamicForm.module.css"

interface DynamicFormProps {
  categoryName: string
  fields: FormField[]
  isLoading: boolean
  onSubmit: (data: Record<string, unknown>) => void
}

export default function DynamicForm({ categoryName, fields, isLoading, onSubmit }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = useCallback(
    (fieldId: string, value: string) => {
      setFormData((prev) => ({ ...prev, [fieldId]: value }))
      // Clear error when user starts typing
      if (errors[fieldId]) {
        setErrors((prev) => {
          const next = { ...prev }
          delete next[fieldId]
          return next
        })
      }
    },
    [errors],
  )

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    fields.forEach((field) => {
      if (field.required && !formData[field.id]?.trim()) {
        newErrors[field.id] = `${field.label} is required`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading form...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Post an Ad in {categoryName}</h2>
      <p className={styles.subtitle}>Fill in the details below to create your listing</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {fields.map((field) => (
          <div key={field.id} className={styles.fieldGroup}>
            <label htmlFor={field.id} className={styles.label}>
              {field.label}
              {field.required && <span className={styles.required}>*</span>}
            </label>

            {field.type === "text" && (
              <input
                type="text"
                id={field.id}
                name={field.name}
                value={formData[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className={`${styles.input} ${errors[field.id] ? styles.inputError : ""}`}
              />
            )}

            {field.type === "number" && (
              <input
                type="number"
                id={field.id}
                name={field.name}
                value={formData[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className={`${styles.input} ${errors[field.id] ? styles.inputError : ""}`}
                min="0"
              />
            )}

            {field.type === "select" && (
              <select
                id={field.id}
                name={field.name}
                value={formData[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className={`${styles.select} ${errors[field.id] ? styles.inputError : ""}`}
              >
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}

            {field.type === "textarea" && (
              <textarea
                id={field.id}
                name={field.name}
                value={formData[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className={`${styles.textarea} ${errors[field.id] ? styles.inputError : ""}`}
                rows={4}
              />
            )}

            {field.type === "radio" && (
              <div className={styles.radioGroup}>
                {field.options?.map((option) => (
                  <label key={option.value} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name={field.name}
                      value={option.value}
                      checked={formData[field.id] === option.value}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      className={styles.radioInput}
                    />
                    <span className={styles.radioCustom} />
                    {option.label}
                  </label>
                ))}
              </div>
            )}

            {errors[field.id] && <span className={styles.errorMessage}>{errors[field.id]}</span>}
          </div>
        ))}

        <div className={styles.imageUpload}>
          <label className={styles.label}>Photos</label>
          <div className={styles.uploadArea}>
            <CameraIcon />
            <p>Click to upload photos</p>
            <span>Add up to 10 photos (Demo - not functional)</span>
          </div>
        </div>

        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post Ad"}
        </button>
      </form>
    </div>
  )
}

function CameraIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}
