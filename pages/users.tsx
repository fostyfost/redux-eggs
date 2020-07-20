import Head from 'next/head'
import React from 'react'

import { withDynamicModuleLoader } from '../components/common/with-dynamic-module-loader'
import { UsersJson } from '../components/users-json'
import { UsersPublicAction } from '../modules/users/action-creators'
import { getUsersModule } from '../modules/users/module'
import { isUsersLoaded } from '../modules/users/selectors'
import { NextPageWithStore } from '../store/contracts'

const UsersPage: NextPageWithStore<{ title: string }> = ({ title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div>
        <h1>{title}</h1>
        <UsersJson />
      </div>
    </>
  )
}

UsersPage.getInitialProps = context => {
  if (!isUsersLoaded(context.store.getState())) {
    context.store.dispatch(UsersPublicAction.loadUsers())
  }

  return { title: 'Users page' }
}

export default withDynamicModuleLoader(UsersPage, [getUsersModule()])
