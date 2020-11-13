import Error from 'next/error'
import Head from 'next/head'

import { withDynamicModuleLoader } from '@/components/common/with-dynamic-module-loader'
import { User } from '@/components/user'
import { UsersIds } from '@/components/users-ids'
import { UsersPublicAction } from '@/modules/users/action-creators'
import { getUsersModule } from '@/modules/users/module'
import { getUserById, isUsersLoaded } from '@/modules/users/selectors'
import { NextPageWithStore } from '@/store/contracts'
import { waitForLoadedState } from '@/store/wait-for-loaded-state'

interface Props {
  errorCode?: number
  title: string
  id?: number
}

const UserPage: NextPageWithStore<Props, Props> = ({ errorCode, title, id }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div>
        <h1>{title}</h1>
        <UsersIds />
        {errorCode ? <Error statusCode={errorCode} /> : !!id && <User id={id} />}
      </div>
    </>
  )
}

UserPage.getInitialProps = async context => {
  if (!context.query.id) {
    if (context.res) {
      context.res.statusCode = 400
    }
    return { title: '400', errorCode: 400 }
  }

  const id = +context.query.id

  if (!id) {
    if (context.res) {
      context.res.statusCode = 400
    }
    return { title: '500', errorCode: 400 }
  }

  if (!isUsersLoaded(context.store.getState())) {
    context.store.dispatch(UsersPublicAction.loadUsers())
  }

  if (context.req && context.res) {
    await waitForLoadedState(context.store, isUsersLoaded)
    const user = getUserById(context.store.getState(), id)
    if (!user) {
      context.res.statusCode = 404
      return { title: `User with ID ${id} no found`, errorCode: 404 }
    }
  }

  return { title: `This is page of user with ID: ${id}`, id }
}

export default withDynamicModuleLoader(UserPage, [getUsersModule()])
