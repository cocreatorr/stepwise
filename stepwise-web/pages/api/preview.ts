import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { secret, slug } = req.query

  // Validate secret token (set SANITY_PREVIEW_SECRET in env)
  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return res.status(401).json({ message: 'Invalid secret' })
  }

  if (!slug) {
    return res.status(400).json({ message: 'Missing slug' })
  }

  // Enable Preview Mode
  res.setPreviewData({})

  // Redirect to the draft page
  res.writeHead(307, { Location: `/posts/${slug}` })
  res.end()
}

