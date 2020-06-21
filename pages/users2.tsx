import Head from 'next/head'
import React from 'react'

import { withDynamicModuleLoader } from '../components/common/with-dynamic-module-loader'
import { Users } from '../components/users'
import { UsersPublicAction } from '../modules/users/action-creators'
import { getUsersModule } from '../modules/users/module'
import { usersSelector } from '../modules/users/selectors'
import { NextPageWithStore } from '../store/contracts'

const UsersPage2: NextPageWithStore<{ title: string }> = ({ title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div>
        <h1>{title}</h1>
        <Users />
      </div>
    </>
  )
}

UsersPage2.getInitialProps = context => {
  if (!usersSelector(context.store.getState())) {
    context.store.dispatch(UsersPublicAction.loadUsers())
  }

  return { title: 'Users page 2' }
}

export default withDynamicModuleLoader(UsersPage2, [getUsersModule()])
