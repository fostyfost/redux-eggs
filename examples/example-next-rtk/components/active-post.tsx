import type { FC } from 'react'
import { useSelector } from 'react-redux'

import { activePostSelector, isActivePostLoading } from '@/eggs/active-post/selectors'

const LoadedActivePost: FC = () => {
  const activePost = useSelector(activePostSelector)

  if (!activePost) {
    return null
  }

  return (
    <div>
      <p>{activePost.body}</p>
    </div>
  )
}

const ActivePost: FC = () => {
  const isLoading = useSelector(isActivePostLoading)

  return isLoading ? (
    <div>
      <p>Active post is loading ...</p>
    </div>
  ) : (
    <LoadedActivePost />
  )
}

export { ActivePost }
