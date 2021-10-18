import type { NextPage } from 'next'
import Error from 'next/error'
import Head from 'next/head'

import { User } from '@/components/user'
import { UsersIds } from '@/components/users-ids'
import { getUsersEgg } from '@/eggs/users'
import { getUserById, isUsersLoaded } from '@/eggs/users/selectors'
import { UsersPublicAction } from '@/eggs/users/slice'
import { wrapperInitializer } from '@/store'
import { waitForLoadedState } from '@/store/wait-for-loaded-state'

interface Props {
  title: string
  errorCode?: number
  id?: number
}

const UserPage: NextPage<Props> = ({ title, errorCode, id }) => {
  const localTitle = `${title} (with Get Initial Props)`

  return (
    <div>
      <Head>
        <title>{localTitle}</title>
      </Head>
      <h1>{localTitle}</h1>
      <UsersIds rootUrl='/users-ids/gip' />
      {errorCode ? <Error statusCode={errorCode} /> : null}
      {!errorCode && id ? <User id={id} /> : null}
    </div>
  )
}

const wrapper = wrapperInitializer.getPageWrapper([getUsersEgg()])

UserPage.getInitialProps = wrapper.wrapGetInitialProps(store => async ctx => {
  const id = Number(ctx.query.id)

  if (!id) {
    if (typeof window === 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ctx.res!.statusCode = 404
    }

    return {
      title: '404',
      errorCode: 404,
    }
  }

  if (!isUsersLoaded(store.getState())) {
    store.dispatch(UsersPublicAction.loadUsers())
  }

  if (typeof window === 'undefined') {
    await waitForLoadedState(store, isUsersLoaded)

    const user = getUserById(store.getState(), id)

    if (!user) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ctx.res!.statusCode = 404

      return {
        title: `User with ID ${id} no found`,
        errorCode: 404,
      }
    }
  }

  return {
    title: `This is page of user with ID: ${id}`,
    id,
  }
})

export default wrapper.wrapPage(UserPage)
