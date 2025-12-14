import { NormalizedField, NormalizedSection } from '@/types/categoryField'

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

function isArray(v: unknown): v is unknown[] {
  return Array.isArray(v)
}

function readString(v: unknown): string {
  return typeof v === 'string' ? v : v == null ? '' : String(v)
}

function readBoolean(v: unknown): boolean {
  return typeof v === 'boolean' ? v : false
}

function readRecord(v: unknown): Record<string, unknown> | null {
  return isObject(v) ? v : null
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

  const hasChoices = isArray(raw.choices) || isArray(raw.values) || isArray(raw.options)

  if (
    type.includes('boolean') ||
    dataType === 'boolean' ||
    widget.includes('switch') ||
    widget.includes('checkbox')
  ) {
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
  const candidates = ['choices', 'values', 'options'] as const
  let list: unknown[] = []

  for (const key of candidates) {
    const v = raw[key]
    if (isArray(v)) {
      list = v
      break
    }
  }

  return list
    .map((c) => {
      const obj = readRecord(c)
      const value = readString(obj?.value ?? obj?.id ?? obj?.key ?? obj?.slug)
      const label = readString(obj?.label ?? obj?.name ?? obj?.title ?? obj?.value ?? value)
      if (!value) return null
      return { value, label }
    })
    .filter(Boolean) as { value: string; label: string }[]
}

function normalizeField(raw: Record<string, unknown>) {
  const key = readString(raw.key ?? raw.slug ?? raw.name ?? raw.id)
  if (!key) return null

  const label = readString(raw.label ?? raw.title ?? raw.name ?? key)
  const required = readBoolean(raw.required ?? raw.isRequired)
  const placeholder = readString(raw.placeholder ?? raw.hint)

  const control = inferControl(raw)
  const choices = control === 'select' || control === 'multiselect' ? extractChoices(raw) : undefined

  return { key, label, required, placeholder: placeholder || undefined, control, choices }
}

function getNestedSections(candidate: Record<string, unknown>): unknown {
  // Try candidate.sections first
  if ('sections' in candidate) return candidate.sections

  // Then candidate.data.sections if data is an object
  const data = candidate.data
  if (isObject(data) && 'sections' in data) return data.sections

  return undefined
}

function getNestedFields(candidate: Record<string, unknown>): unknown {
  // Try candidate.fields first
  if ('fields' in candidate) return candidate.fields

  // Then candidate.data if it is an array of fields
  const data = candidate.data
  if (isArray(data)) return data

  // Or candidate.data.fields if it's an object
  if (isObject(data) && 'fields' in data) return data.fields

  return undefined
}

/**
 * Normalize OLX "categoryFields" response into sections + fields.
 * Supports both:
 * - grouped-by-section responses (preferred by the PDF query params)
 * - flat arrays of fields
 * - splitByCategoryIDs maps (we flatten the first match)
 */
export function normalizeCategoryFields(rawResponse: unknown): NormalizedSection[] {
  if (!isObject(rawResponse)) return []

  // Candidate can be rawResponse or rawResponse.data if it is an object.
  const candidate: Record<string, unknown> = isObject(rawResponse.data)
    ? (rawResponse.data as Record<string, unknown>)
    : rawResponse

  const sectionsAny = getNestedSections(candidate)

  if (isArray(sectionsAny)) {
    return sectionsAny
      .map((s): NormalizedSection | null => {
        const sec = readRecord(s)
        if (!sec) return null

        const title = toStringSafe(sec.title ?? sec.name ?? 'Details')
        const fieldsRaw = isArray(sec.fields) ? sec.fields : []

        const fields = fieldsRaw
          .map((f) => {
            const fo = readRecord(f)
            return fo ? normalizeField(fo) : null
          })
          .filter(Boolean) as NormalizedField[]

        return fields.length ? { title, fields } : null
      })
      .filter(Boolean) as NormalizedSection[]
  }

  const fieldsAny = getNestedFields(candidate)

  if (isArray(fieldsAny)) {
    const fields = fieldsAny
      .map((f) => {
        const fo = readRecord(f)
        return fo ? normalizeField(fo) : null
      })
      .filter(Boolean) as NormalizedField[]

    return fields.length ? [{ title: 'Details', fields }] : []
  }

  // splitByCategoryIDs=true may return a map keyed by category IDs
  // We'll flatten the first array-like value we find.
  for (const v of Object.values(candidate)) {
    if (isArray(v)) {
      const fields = v
        .map((f) => {
          const fo = readRecord(f)
          return fo ? normalizeField(fo) : null
        })
        .filter(Boolean) as NormalizedField[]
      return fields.length ? [{ title: 'Details', fields }] : []
    }

    if (isObject(v) && isArray(v.fields)) {
      const fields = v.fields
        .map((f) => {
          const fo = readRecord(f)
          return fo ? normalizeField(fo) : null
        })
        .filter(Boolean) as NormalizedField[]
      return fields.length ? [{ title: 'Details', fields }] : []
    }
  }

  return []
}
