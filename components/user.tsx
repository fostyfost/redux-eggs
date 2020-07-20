import Error from 'next/error'
import Head from 'next/head'
import React, { FC } from 'react'
import { useSelector } from 'react-redux'

import { UsersAwareState } from '../modules/users/contracts/state'
import { getUserById, isUsersLoading } from '../modules/users/selectors'

const User: FC<{ title: string; id: number }> = ({ title, id }) => {
  const isLoading = useSelector(isUsersLoading)
  const user = useSelector((state: UsersAwareState) => getUserById(state, id))

  if (isLoading) {
    return <div>Load user with ID {id} ...</div>
  }

  if (!user) {
    return <Error statusCode={404} />
  }

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div>
        <h1>{title}</h1>
        <div>
          <pre>
            <code>{JSON.stringify(user, null, 2)}</code>
          </pre>
        </div>
      </div>
    </>
  )
}

export { User }
