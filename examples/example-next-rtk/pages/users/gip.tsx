import type { NextPage } from 'next'
import Head from 'next/head'

import { UsersJson } from '@/components/users-json'
import { getUsersEgg } from '@/eggs/users'
import { isUsersLoaded } from '@/eggs/users/selectors'
import { UsersPublicAction } from '@/eggs/users/slice'
import { wrapperInitializer } from '@/store'

interface Props {
  title: string
}

const UsersPage: NextPage<Props> = ({ title }) => {
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

UsersPage.getInitialProps = wrapper.wrapGetInitialProps(store => () => {
  if (!isUsersLoaded(store.getState())) {
    store.dispatch(UsersPublicAction.loadUsers())
  }

  return {
    title: 'Users page (with Get Initial Props)',
  }
})

export default wrapper.wrapPage(UsersPage)
