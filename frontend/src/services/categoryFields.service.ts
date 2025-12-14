export type RawCategoryFieldsResponse = unknown

export interface CategoryFieldsParams {
  categorySlugs: string
  includeChildCategories?: boolean
  splitByCategoryIDs?: boolean
  flatChoices?: boolean
  groupChoicesBySection?: boolean
  flat?: boolean
}

export async function fetchCategoryFields(params: CategoryFieldsParams): Promise<RawCategoryFieldsResponse> {
  const qs = new URLSearchParams({
    categorySlugs: params.categorySlugs,
    includeChildCategories: String(params.includeChildCategories ?? true),
    splitByCategoryIDs: String(params.splitByCategoryIDs ?? true),
    flatChoices: String(params.flatChoices ?? true),
    groupChoicesBySection: String(params.groupChoicesBySection ?? true),
    flat: String(params.flat ?? true),
  })

  const r = await fetch(`/api/olx/category-fields?${qs.toString()}`)
  if (!r.ok) throw new Error('Failed to load category fields')
  return r.json()
}
