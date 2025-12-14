import { NormalizedField, NormalizedSection } from '@/types/categoryField'

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

function toStringSafe(v: unknown): string {
  return typeof v === 'string' ? v : v == null ? '' : String(v)
}

/**
 * Heuristic mapping:
 * We try to infer field "control" from common OLX-like shapes (type/dataType/widget/choices/etc).
 * If the API shape changes, this fails gracefully (falls back to text).
 */
function inferControl(raw: Record<string, unknown>): NormalizedField['control'] {
  const type = toStringSafe(raw.type).toLowerCase()
  const dataType = toStringSafe(raw.dataType).toLowerCase()
  const widget = toStringSafe(raw.widget).toLowerCase()

  const hasChoices =
    Array.isArray(raw.choices) ||
    Array.isArray(raw.values) ||
    Array.isArray(raw.options)

  if (type.includes('boolean') || dataType === 'boolean' || widget.includes('switch') || widget.includes('checkbox')) {
    return 'boolean'
  }

  if (hasChoices && (type.includes('multi') || widget.includes('multi'))) return 'multiselect'
  if (hasChoices) return 'select'

  if (type.includes('text') || dataType === 'string') return 'text'
  if (type.includes('textarea') || widget.includes('textarea')) return 'textarea'
  if (type.includes('number') || dataType === 'number' || dataType === 'integer') return 'number'

  return 'text'
}

function extractChoices(raw: Record<string, unknown>) {
  const list =
    (Array.isArray(raw.choices) && raw.choices) ||
    (Array.isArray(raw.values) && raw.values) ||
    (Array.isArray(raw.options) && raw.options) ||
    []

  return list
    .map((c: any) => {
      const value = toStringSafe(c?.value ?? c?.id ?? c?.key ?? c?.slug)
      const label = toStringSafe(c?.label ?? c?.name ?? c?.title ?? c?.value ?? value)
      if (!value) return null
      return { value, label }
    })
    .filter(Boolean) as { value: string; label: string }[]
}

function normalizeField(raw: Record<string, unknown>): NormalizedField | null {
  const key = toStringSafe(raw.key ?? raw.slug ?? raw.name ?? raw.id)
  if (!key) return null

  const label = toStringSafe(raw.label ?? raw.title ?? raw.name ?? key)
  const required = Boolean(raw.required ?? raw.isRequired ?? false)
  const placeholder = toStringSafe(raw.placeholder ?? raw.hint ?? '')

  const control = inferControl(raw)
  const choices = control === 'select' || control === 'multiselect' ? extractChoices(raw) : undefined

  return { key, label, required, placeholder: placeholder || undefined, control, choices }
}

/**
 * Normalize OLX "categoryFields" response into sections + fields.
 * Supports both:
 * - grouped-by-section responses (preferred by the PDF query params)
 * - flat arrays of fields
 */
export function normalizeCategoryFields(rawResponse: unknown): NormalizedSection[] {
  if (!isObject(rawResponse)) return []

  // Common shapes we attempt:
  // 1) { sections: [...] }
  // 2) { data: { sections: [...] } }
  // 3) { fields: [...] }
  // 4) { data: [...] }
  // 5) { ...categoryIdMap } (splitByCategoryIDs)
  const candidate =
    (isObject(rawResponse.data) ? rawResponse.data : rawResponse) as Record<string, unknown>

  const sectionsAny = candidate.sections ?? (isObject(candidate.data) ? (candidate.data as any).sections : undefined)

  if (Array.isArray(sectionsAny)) {
    return sectionsAny
      .map((s: any) => {
        const title = toStringSafe(s?.title ?? s?.name ?? 'Details')
        const fieldsRaw = Array.isArray(s?.fields) ? s.fields : []
        const fields = fieldsRaw.map((f: any) => (isObject(f) ? normalizeField(f) : null)).filter(Boolean) as NormalizedField[]
        return { title, fields }
      })
      .filter((sec) => sec.fields.length > 0)
  }

  const fieldsAny = candidate.fields ?? candidate.data
  if (Array.isArray(fieldsAny)) {
    const fields = fieldsAny
      .map((f: any) => (isObject(f) ? normalizeField(f) : null))
      .filter(Boolean) as NormalizedField[]

    return fields.length ? [{ title: 'Details', fields }] : []
  }

  // splitByCategoryIDs=true may return a map keyed by category IDs
  // We'll flatten the first array-like value we find.
  for (const v of Object.values(candidate)) {
    if (Array.isArray(v)) {
      const fields = v.map((f: any) => (isObject(f) ? normalizeField(f) : null)).filter(Boolean) as NormalizedField[]
      return fields.length ? [{ title: 'Details', fields }] : []
    }
    if (isObject(v) && Array.isArray((v as any).fields)) {
      const fields = (v as any).fields
        .map((f: any) => (isObject(f) ? normalizeField(f) : null))
        .filter(Boolean) as NormalizedField[]
      return fields.length ? [{ title: 'Details', fields }] : []
    }
  }

  return []
}
