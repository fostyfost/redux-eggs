import type { NextPage } from 'next'
import Error from 'next/error'
import Head from 'next/head'
import type { FC } from 'react'
import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'

import { ActivePost } from '@/components/active-post'
import { DynamicPosts } from '@/components/posts'
import { getActivePostEgg } from '@/eggs/active-post'
import { ActivePostPublicAction } from '@/eggs/active-post/action-creators'
import { activePostSelector, isActivePostLoaded, isActivePostLoading } from '@/eggs/active-post/selectors'
import { wrapperInitializer } from '@/store'
import { waitForLoadedState } from '@/store/wait-for-loaded-state'

interface HeadingProps {
  title: string
}

type Props = HeadingProps & { errorCode?: number }

const postTitleSelector = createSelector(isActivePostLoading, activePostSelector, (isLoading, activePost): string => {
  if (isLoading) {
    return 'Post is loading ...'
  }

  return `${activePost?.title || 'Empty title'}`
})

const Heading: FC<HeadingProps> = ({ title }) => {
  const postTitle = useSelector(postTitleSelector)

  return (
    <>
      <Head>
        <title>
          {postTitle} {title}
        </title>
      </Head>
      <h1>
        {postTitle} {title}
      </h1>
    </>
  )
}

const wrapper = wrapperInitializer.getPageWrapper([getActivePostEgg()])

const ActivePostPage: NextPage<Props> = wrapper.wrapPage(({ errorCode, title }) => {
  if (errorCode) {
    return <Error statusCode={errorCode} />
  }

  return (
    <div>
      <Heading title={title} />
      <ActivePost />
      <DynamicPosts rootUrl='/posts/gip' />
    </div>
  )
})

ActivePostPage.getInitialProps = wrapper.wrapGetInitialProps(store => async ctx => {
  const title = '(with Get Initial Props)'

  if (typeof ctx.query.id !== 'string') {
    if (typeof window === 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ctx.res!.statusCode = 404
    }

    return {
      title,
      errorCode: 404,
    }
  }

  store.dispatch(ActivePostPublicAction.loadActivePost(ctx.query.id))

  if (typeof window === 'undefined') {
    await waitForLoadedState(store, isActivePostLoaded)

    const activePost = activePostSelector(store.getState())

    if (!activePost) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ctx.res!.statusCode = 404

      return {
        title,
        errorCode: 404,
      }
    }
  }

  return {
    title,
  }
})

export default ActivePostPage
