import Error from 'next/error'
import React from 'react'

import { withDynamicModuleLoader } from '../../components/common/with-dynamic-module-loader'
import { User } from '../../components/user'
import { UsersPublicAction } from '../../modules/users/action-creators'
import { getUsersModule } from '../../modules/users/module'
import { getUserById, isUsersLoaded } from '../../modules/users/selectors'
import { NextPageWithStore } from '../../store/contracts'
import { waitForLoadedState } from '../../store/wait-for-loaded-state'

const UserPage: NextPageWithStore<{ errorCode?: number; title: string; id: number }> = ({ errorCode, title, id }) => {
  if (errorCode) {
    return <Error statusCode={errorCode} />
  }

  return <User title={title} id={id} />
}

UserPage.getInitialProps = async context => {
  if (!context.query.id) {
    if (context.res) {
      context.res.statusCode = 400
    }
    return { errorCode: 400 }
  }

  const id = +context.query.id

  if (!id) {
    if (context.res) {
      context.res.statusCode = 400
    }
    return { errorCode: 400 }
  }

  if (!isUsersLoaded(context.store.getState())) {
    context.store.dispatch(UsersPublicAction.loadUsers())
  }

  if (context.req && context.res) {
    await waitForLoadedState(context.store, isUsersLoaded)
    const user = getUserById(context.store.getState(), id)
    if (!user) {
      context.res.statusCode = 404
      return { errorCode: 404 }
    }
  }

  return { title: `This is page of user with ID: ${id}`, id }
}

export default withDynamicModuleLoader(UserPage, [getUsersModule()])
