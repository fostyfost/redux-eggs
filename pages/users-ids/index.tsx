import Head from 'next/head'

import { withDynamicModuleLoader } from '@/components/common/with-dynamic-module-loader'
import { UsersIds } from '@/components/users-ids'
import { UsersPublicAction } from '@/modules/users/action-creators'
import { getUsersModule } from '@/modules/users/module'
import { isUsersLoaded } from '@/modules/users/selectors'
import { NextPageWithStore } from '@/store/contracts'

interface Props {
  title: string
}

const UsersIdsPage: NextPageWithStore<Props, Props> = ({ title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div>
        <h1>{title}</h1>
        <UsersIds />
      </div>
    </>
  )
}

UsersIdsPage.getInitialProps = context => {
  if (!isUsersLoaded(context.store.getState())) {
    context.store.dispatch(UsersPublicAction.loadUsers())
  }

  return { title: 'Users IDs page' }
}

export default withDynamicModuleLoader(UsersIdsPage, [getUsersModule()])
