import { getInjector } from '@redux-eggs/react'
import NextLink from 'next/link'
import type { FC } from 'react'
import { useInView } from 'react-intersection-observer'
import { useSelector } from 'react-redux'

import { getPostsEgg } from '@/eggs/posts'
import { PostsPublicAction } from '@/eggs/posts/action-creators'
import { isPostsLoading, postsSelector } from '@/eggs/posts/selectors'

interface Props {
  rootUrl: string
}

const LoadedPosts: FC<Props> = ({ rootUrl }) => {
  const posts = useSelector(postsSelector)

  return (
    <div>
      {posts.map(post => (
        <NextLink
          key={post.id}
          href={`${rootUrl}/${post.id}`}
          scroll={false}
          style={{ display: 'block', padding: '10px' }}
        >
          {post.title}
        </NextLink>
      ))}
    </div>
  )
}

export const Posts: FC<Props> = ({ rootUrl }) => {
  const isLoading = useSelector(isPostsLoading)

  return isLoading ? <div>Posts are loading ...</div> : <LoadedPosts rootUrl={rootUrl} />
}

const Injector = getInjector([getPostsEgg({ afterAdd: store => store.dispatch(PostsPublicAction.loadPosts()) })])

export const DynamicPosts: FC<Props> = ({ rootUrl }) => {
  const [ref, inView] = useInView()

  return (
    <div ref={ref}>
      {inView ? (
        <Injector.Wrapper>
          <Posts rootUrl={rootUrl} />
        </Injector.Wrapper>
      ) : null}
    </div>
  )
}
