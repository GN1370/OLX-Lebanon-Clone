import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const r = await fetch('https://www.olx.com.lb/api/categories', {
      headers: { Accept: 'application/json' },
    })

    if (!r.ok) {
      return res.status(r.status).json({ message: 'Failed to fetch categories' })
    }

    const data = await r.json()
    return res.status(200).json(data)
  } catch {
    return res.status(500).json({ message: 'Server error while fetching categories' })
  }
}
