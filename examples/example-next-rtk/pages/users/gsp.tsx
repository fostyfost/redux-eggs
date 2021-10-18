import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import Head from 'next/head'

import { UsersJson } from '@/components/users-json'
import { getUsersEgg } from '@/eggs/users'
import { UsersPublicAction } from '@/eggs/users/slice'
import { wrapperInitializer } from '@/store'

interface Props {
  title: string
}

const UsersPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ title }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      <UsersJson />
    </div>
  )
}

const wrapper = wrapperInitializer.getPageWrapper([getUsersEgg()])

export const getStaticProps: GetStaticProps<Props> = wrapper.wrapGetStaticProps(store => () => {
  store.dispatch(UsersPublicAction.loadUsers())

  return {
    props: {
      title: 'Users page (with Get Static Props)',
    },
  }
})

export default wrapper.wrapPage(UsersPage)
