import React from 'react'
import Head from 'next/head'
import { NextPage } from 'next'
import { Users } from '../components/users'
import { getUsersModule } from '../modules/users/module'
import { withDynamicModuleLoader } from '../components/common/with-dynamic-module-loader'

const UsersPage: NextPage<{ title: string }> = ({ title }) => {
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

UsersPage.getInitialProps = () => {
  return { title: 'Users page' }
}

export default withDynamicModuleLoader(UsersPage, [getUsersModule()])
