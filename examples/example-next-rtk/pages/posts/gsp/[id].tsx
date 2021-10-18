import type { InferGetStaticPathsQueryType } from '@redux-eggs/next'
import type { GetStaticPropsContext, InferGetStaticPropsType, NextPage } from 'next'
import Head from 'next/head'

import { ActivePost } from '@/components/active-post'
import { DynamicPosts } from '@/components/posts'
import { getActivePostEgg } from '@/eggs/active-post'
import { activePostSelector, isActivePostLoaded } from '@/eggs/active-post/selectors'
import { ActivePostPublicAction } from '@/eggs/active-post/slice'
import { getPostsEgg } from '@/eggs/posts'
import { isPostsLoaded, postsSelector } from '@/eggs/posts/selectors'
import { PostsPublicAction } from '@/eggs/posts/slice'
import { wrapperInitializer } from '@/store'
import { waitForLoadedState } from '@/store/wait-for-loaded-state'

const wrapper = wrapperInitializer.getPageWrapper([getActivePostEgg()])

const ActivePostPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = wrapper.wrapPage(({ title }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      <ActivePost />
      <DynamicPosts rootUrl='/posts/gsp' />
    </div>
  )
})

export const getStaticPaths = wrapper.wrapGetStaticPaths(store => async () => {
  store.addEggs([getPostsEgg()])

  store.dispatch(PostsPublicAction.loadPosts())

  await waitForLoadedState(store, isPostsLoaded)

  const posts = postsSelector(store.getState())

  return {
    paths: posts.map(post => ({ params: { id: post.id } })),
    fallback: false,
  }
})

type GspContextWithQuery = GetStaticPropsContext<InferGetStaticPathsQueryType<typeof getStaticPaths>>

export const getStaticProps = wrapper.wrapGetStaticProps(store => async (context: GspContextWithQuery) => {
  if (typeof context.params?.id !== 'string') {
    return {
      notFound: true,
    }
  }

  store.dispatch(ActivePostPublicAction.loadActivePost(context.params.id))

  await waitForLoadedState(store, isActivePostLoaded)

  const activePost = activePostSelector(store.getState())

  if (!activePost) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      title: `${activePost.title} (with Get Static Props)`,
    },
  }
})

export default ActivePostPage
