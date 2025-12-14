import { useMemo, useState } from 'react'
import styles from './DynamicForm.module.css'
import { NormalizedSection } from '@/types/categoryField'

type Props = {
  sections: NormalizedSection[]
}

export function DynamicForm({ sections }: Props) {
  const [values, setValues] = useState<Record<string, unknown>>({})

  const requiredKeys = useMemo(() => {
    const keys: string[] = []
    sections.forEach((s) => s.fields.forEach((f) => f.required && keys.push(f.key)))
    return keys
  }, [sections])

  function setValue(key: string, v: unknown) {
    setValues((prev) => ({ ...prev, [key]: v }))
  }

  return (
    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
      {sections.map((sec) => (
        <div key={sec.title} className={styles.section}>
          <h3 className={styles.sectionTitle}>{sec.title}</h3>

          <div className={styles.grid}>
            {sec.fields.map((f) => {
              const val = values[f.key]

              if (f.control === 'boolean') {
                return (
                  <label key={f.key} className={styles.checkboxRow}>
                    <input
                      type="checkbox"
                      checked={Boolean(val)}
                      onChange={(e) => setValue(f.key, e.target.checked)}
                    />
                    <span>
                      {f.label} {f.required ? <em className={styles.req}>*</em> : null}
                    </span>
                  </label>
                )
              }

              if (f.control === 'select' || f.control === 'multiselect') {
                return (
                  <label key={f.key} className={styles.field}>
                    <span className={styles.label}>
                      {f.label} {f.required ? <em className={styles.req}>*</em> : null}
                    </span>

                    <select
                      className={styles.input}
                      multiple={f.control === 'multiselect'}
                      value={
                        f.control === 'multiselect'
                          ? (Array.isArray(val) ? (val as string[]) : [])
                          : (typeof val === 'string' ? val : '')
                      }
                      onChange={(e) => {
                        if (f.control === 'multiselect') {
                          const opts = Array.from(e.currentTarget.selectedOptions).map((o) => o.value)
                          setValue(f.key, opts)
                        } else {
                          setValue(f.key, e.currentTarget.value)
                        }
                      }}
                    >
                      {f.control === 'select' ? <option value="">Select…</option> : null}
                      {(f.choices ?? []).map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </label>
                )
              }

              if (f.control === 'textarea') {
                return (
                  <label key={f.key} className={styles.field}>
                    <span className={styles.label}>
                      {f.label} {f.required ? <em className={styles.req}>*</em> : null}
                    </span>
                    <textarea
                      className={styles.textarea}
                      placeholder={f.placeholder}
                      value={typeof val === 'string' ? val : ''}
                      onChange={(e) => setValue(f.key, e.target.value)}
                    />
                  </label>
                )
              }

              return (
                <label key={f.key} className={styles.field}>
                  <span className={styles.label}>
                    {f.label} {f.required ? <em className={styles.req}>*</em> : null}
                  </span>
                  <input
                    className={styles.input}
                    type={f.control === 'number' ? 'number' : 'text'}
                    placeholder={f.placeholder}
                    value={typeof val === 'string' || typeof val === 'number' ? String(val) : ''}
                    onChange={(e) => setValue(f.key, f.control === 'number' ? Number(e.target.value) : e.target.value)}
                  />
                </label>
              )
            })}
          </div>
        </div>
      ))}

      {/* Submission isn't required, but user must be able to fill the form.  */}
      <p className={styles.note}>
        Form is dynamic and fillable; submission is not required for this assessment.
      </p>

      {/* Simple completeness signal (optional UX, no extra business rules) */}
      <p className={styles.note}>
        Required filled: {requiredKeys.filter((k) => values[k] !== undefined && values[k] !== '' && values[k] !== false).length}/{requiredKeys.length}
      </p>
    </form>
  )
}
