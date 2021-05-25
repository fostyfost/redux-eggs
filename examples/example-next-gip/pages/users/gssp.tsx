import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'

import { UsersJson } from '@/components/users-json'
import { getUsersEgg } from '@/eggs/users'
import { UsersPublicAction } from '@/eggs/users/action-creators'
import { wrapperInitializer } from '@/store'

interface Props {
  title: string
}

const UsersPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ title }) => {
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

export const getServerSideProps: GetServerSideProps<Props> = wrapper.wrapGetServerSideProps(store => async () => {
  store.dispatch(UsersPublicAction.loadUsers())

  return {
    props: {
      title: 'Users page (with Get Server-side Props)',
    },
  }
})

export default wrapper.wrapPage(UsersPage)
