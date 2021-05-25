import type { NextPage } from 'next'
import Head from 'next/head'

import { Posts } from '@/components/posts'
import { getPostsEgg } from '@/eggs/posts'
import { PostsPublicAction } from '@/eggs/posts/action-creators'
import { wrapperInitializer } from '@/store'

interface Props {
  title: string
}

const wrapper = wrapperInitializer.getPageWrapper([getPostsEgg()])

const PostsPage: NextPage<Props> = wrapper.wrapPage(({ title }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      <Posts rootUrl='/posts/gip' />
    </div>
  )
})

PostsPage.getInitialProps = wrapper.wrapGetInitialProps(store => () => {
  store.dispatch(PostsPublicAction.loadPosts())

  return {
    title: 'Posts page (with Get Initial Props)',
  }
})

export default PostsPage
