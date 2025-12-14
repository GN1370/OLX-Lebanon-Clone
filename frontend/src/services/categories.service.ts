export type RawCategoriesResponse = unknown

export async function fetchCategories(): Promise<RawCategoriesResponse> {
  const r = await fetch('/api/olx/categories')
  if (!r.ok) throw new Error('Failed to load categories')
  return r.json()
}
