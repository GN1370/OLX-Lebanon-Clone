import styles from './Input.module.css'

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

export function Input({ label, ...props }: Props) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <input className={styles.input} {...props} />
    </label>
  )
}
