import { NextApiResponse } from 'next'

export default function handler(req, res: NextApiResponse) {
  res.clearPreviewData()
  res.end('preview disabled')
}
