import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import Head from 'next/head'

import { Posts } from '@/components/posts'
import { getPostsEgg } from '@/eggs/posts'
import { PostsPublicAction } from '@/eggs/posts/slice'
import { wrapperInitializer } from '@/store'

interface Props {
  title: string
}

const wrapper = wrapperInitializer.getPageWrapper([getPostsEgg()])

const PostsPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = wrapper.wrapPage(({ title }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      <Posts rootUrl='/posts/gsp' />
    </div>
  )
})

export const getStaticProps: GetStaticProps<Props> = wrapper.wrapGetStaticProps(store => () => {
  store.dispatch(PostsPublicAction.loadPosts())

  return {
    props: {
      title: 'Posts page (with Get Static Props)',
    },
  }
})

export default PostsPage
