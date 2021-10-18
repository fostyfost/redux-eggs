import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'

import { UsersIds } from '@/components/users-ids'
import { getUsersEgg } from '@/eggs/users'
import { UsersPublicAction } from '@/eggs/users/slice'
import { wrapperInitializer } from '@/store'

interface Props {
  title: string
}

const UsersIdsPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ title }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      <UsersIds rootUrl='/users-ids/gssp' />
    </div>
  )
}

const wrapper = wrapperInitializer.getPageWrapper([getUsersEgg()])

export const getServerSideProps: GetServerSideProps<Props> = wrapper.wrapGetServerSideProps(store => async () => {
  store.dispatch(UsersPublicAction.loadUsers())

  return {
    props: {
      title: 'Users IDs page (with Get Server-side Props)',
    },
  }
})

export default wrapper.wrapPage(UsersIdsPage)
