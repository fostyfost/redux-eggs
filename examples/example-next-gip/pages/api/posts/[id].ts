import type { NextApiHandler, NextApiResponse } from 'next'

import type { PostsResponseItem } from '@/eggs/posts/contracts/api-response'
import { fetchAsJson } from '@/utils/fetchAsJson'

const sendError = (res: NextApiResponse, id: string): void => {
  res.status(404).json({ message: `Post with id ${id} not found.` })
}

const handler: NextApiHandler = async (req, res) => {
  const { id } = req.query as { id: string }

  try {
    const responseItems = await fetchAsJson<PostsResponseItem[]>('https://jsonplaceholder.typicode.com/posts')

    const post = responseItems.slice(0, 10).find(post => post.id.toString() === id)

    if (post && post.id.toString() === id) {
      res.status(200).json(post)
    } else {
      sendError(res, id)
    }
  } catch (error) {
    console.error('[Error in `/api/posts/[id]` handler]', error)
    sendError(res, id)
  }
}

export default handler
