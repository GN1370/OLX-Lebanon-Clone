import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // We pass through query params exactly as the PDF shows. 
    const qs = new URLSearchParams(req.query as Record<string, string>).toString()
    const url = `https://www.olx.com.lb/api/categoryFields?${qs}`

    const r = await fetch(url, {
      headers: { Accept: 'application/json' },
    })

    if (!r.ok) {
      return res.status(r.status).json({ message: 'Failed to fetch category fields' })
    }

    const data = await r.json()
    return res.status(200).json(data)
  } catch {
    return res.status(500).json({ message: 'Server error while fetching category fields' })
  }
}
