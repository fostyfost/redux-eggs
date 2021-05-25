import type { InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'

import { ActivePost } from '@/components/active-post'
import { DynamicPosts } from '@/components/posts'
import { getActivePostEgg } from '@/eggs/active-post'
import { ActivePostPublicAction } from '@/eggs/active-post/action-creators'
import { activePostSelector, isActivePostLoaded } from '@/eggs/active-post/selectors'
import { wrapperInitializer } from '@/store'
import { waitForLoadedState } from '@/store/wait-for-loaded-state'

const wrapper = wrapperInitializer.getPageWrapper([getActivePostEgg()])

type PageType = NextPage<InferGetServerSidePropsType<typeof getServerSideProps>>

const ActivePostPage: PageType = wrapper.wrapPage(({ title }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      <ActivePost />
      <DynamicPosts rootUrl='/posts/gssp' />
    </div>
  )
})

export const getServerSideProps = wrapper.wrapGetServerSideProps(store => async context => {
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
      title: `${activePost.title} (with Get Server-side Props)`,
    },
  }
})

export default ActivePostPage
