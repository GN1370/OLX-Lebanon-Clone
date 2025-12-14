export type FieldControl =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'boolean'

export interface FieldChoice {
  value: string
  label: string
}

export interface NormalizedField {
  key: string
  label: string
  required: boolean
  control: FieldControl
  placeholder?: string
  choices?: FieldChoice[]
}

export interface NormalizedSection {
  title: string
  fields: NormalizedField[]
}
