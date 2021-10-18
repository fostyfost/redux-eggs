import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'

import { Posts } from '@/components/posts'
import { getPostsEgg } from '@/eggs/posts'
import { PostsPublicAction } from '@/eggs/posts/slice'
import { wrapperInitializer } from '@/store'

interface Props {
  title: string
}

const wrapper = wrapperInitializer.getPageWrapper([getPostsEgg()])

const PostsPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = wrapper.wrapPage(({ title }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      <Posts rootUrl='/posts/gssp' />
    </div>
  )
})

export const getServerSideProps: GetServerSideProps<Props> = wrapper.wrapGetServerSideProps(store => async () => {
  store.dispatch(PostsPublicAction.loadPosts())

  return {
    props: {
      title: 'Posts page (with Get Server-side Props)',
    },
  }
})

export default PostsPage
