import { CategoryNode } from './category.types'

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

export function parseCategories(raw: any): CategoryNode[] {
  const list = Array.isArray(raw) ? raw : raw?.data ?? raw?.categories ?? []
  if (!Array.isArray(list)) return []

  const mapNode = (c: any): CategoryNode | null => {
    const name = String(c?.name ?? c?.title ?? '')
    const slug = String(c?.slug ?? c?.categorySlug ?? '')
    if (!name || !slug) return null

    const childrenRaw = c?.children ?? c?.subcategories ?? c?.items
    const children = Array.isArray(childrenRaw)
      ? (childrenRaw.map(mapNode).filter(Boolean) as CategoryNode[])
      : undefined

    return { name, slug, children: children?.length ? children : undefined }
  }

  return list.map(mapNode).filter(Boolean) as CategoryNode[]
}

export function findNodeBySlug(nodes: CategoryNode[], slug: string): CategoryNode | null {
  for (const n of nodes) {
    if (n.slug === slug) return n
    if (n.children) {
      const hit = findNodeBySlug(n.children, slug)
      if (hit) return hit
    }
  }
  return null
}

export function findPathBySlug(nodes: CategoryNode[], slug: string): CategoryNode[] {
  for (const n of nodes) {
    if (n.slug === slug) return [n]
    if (n.children) {
      const childPath = findPathBySlug(n.children, slug)
      if (childPath.length) return [n, ...childPath]
    }
  }
  return []
}

export function toOptions(nodes: CategoryNode[]) {
  return nodes.map((n) => ({ value: n.slug, label: n.name }))
}
