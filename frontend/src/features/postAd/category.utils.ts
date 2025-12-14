import { CategoryNode } from './category.types'

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

function isArray(v: unknown): v is unknown[] {
  return Array.isArray(v)
}

function readString(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

function getArray(obj: Record<string, unknown>, keys: string[]): unknown[] {
  for (const k of keys) {
    const v = obj[k]
    if (isArray(v)) return v
  }
  return []
}

export function parseCategories(raw: unknown): CategoryNode[] {
  const list: unknown[] =
    isArray(raw) ? raw :
    isObject(raw) ? (
      isArray(raw.data) ? raw.data :
      isArray(raw.categories) ? raw.categories :
      []
    ) : []

  const mapNode = (c: unknown): CategoryNode | null => {
    if (!isObject(c)) return null

    const name = readString(c.name) || readString(c.title)
    const slug = readString(c.slug) || readString(c.categorySlug)
    if (!name || !slug) return null

    const childrenRaw = getArray(c, ['children', 'subcategories', 'items'])
    const children = childrenRaw.map(mapNode).filter(Boolean) as CategoryNode[]

    return { name, slug, children: children.length ? children : undefined }
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
