import React from 'react'
import Head from 'next/head'
import { Users } from '../components/users'
import { getUsersModule } from '../modules/users/module'
import { withDynamicModuleLoader } from '../components/common/with-dynamic-module-loader'
import { NextPageWithStore } from '../store/contracts'
import { UsersPublicAction } from '../modules/users/action-creators'
import { usersSelector } from '../modules/users/selectors'

const UsersPage: NextPageWithStore<{ title: string }> = ({ title }) => {
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

UsersPage.getInitialProps = ctx => {
  if (!usersSelector(ctx.store.getState())) {
    ctx.store.dispatch(UsersPublicAction.loadUsers())
  }

  return { title: 'Users page' }
}

export default withDynamicModuleLoader(UsersPage, [getUsersModule()])
