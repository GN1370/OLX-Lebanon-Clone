import styles from './Select.module.css'

type Option = { value: string; label: string }

type Props = {
  label: string
  value: string
  options: Option[]
  placeholder?: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function Select({ label, value, options, placeholder = 'Select…', onChange, disabled }: Props) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <select
        className={styles.select}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.currentTarget.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
