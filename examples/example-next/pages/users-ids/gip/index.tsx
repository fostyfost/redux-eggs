import type { NextPage } from 'next'
import Head from 'next/head'

import { UsersIds } from '@/components/users-ids'
import { getUsersEgg } from '@/eggs/users'
import { UsersPublicAction } from '@/eggs/users/action-creators'
import { isUsersLoaded } from '@/eggs/users/selectors'
import { wrapperInitializer } from '@/store'

interface Props {
  title: string
}

const UsersIdsPage: NextPage<Props> = ({ title }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      <UsersIds rootUrl='/users-ids/gip' />
    </div>
  )
}

const wrapper = wrapperInitializer.getPageWrapper([getUsersEgg()])

UsersIdsPage.getInitialProps = wrapper.wrapGetInitialProps(store => () => {
  if (!isUsersLoaded(store.getState())) {
    store.dispatch(UsersPublicAction.loadUsers())
  }

  return {
    title: 'Users IDs page (with Get Initial Props)',
  }
})

export default wrapper.wrapPage(UsersIdsPage)
