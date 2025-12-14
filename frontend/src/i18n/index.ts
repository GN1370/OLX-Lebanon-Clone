import { en } from './en'
import { ar } from './ar'

export type Lang = 'en' | 'ar'

export const dictionaries = { en, ar } as const

export function isLang(v: string): v is Lang {
  return v === 'en' || v === 'ar'
}

export function dirFor(lang: Lang) {
  return lang === 'ar' ? 'rtl' : 'ltr'
}
