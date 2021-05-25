import type { NextApiHandler } from 'next'

import type { PostsResponseItem } from '@/eggs/posts/contracts/api-response'
import { fetchAsJson } from '@/utils/fetchAsJson'

const handler: NextApiHandler = async (_, res) => {
  try {
    const responseItems = await fetchAsJson<PostsResponseItem[]>('https://jsonplaceholder.typicode.com/posts')
    res.status(200).json(responseItems.slice(0, 10))
  } catch (error) {
    console.error('[Error in `/api/posts` handler]', error)
    res.status(200).json([])
  }
}

export default handler
