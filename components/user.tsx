import Error from 'next/error'
import type { FC } from 'react'
import { useSelector } from 'react-redux'

import type { UsersAwareState } from '@/modules/users/contracts/state'
import { getUserById, isUsersLoading } from '@/modules/users/selectors'

const User: FC<{ id: number }> = ({ id }) => {
  const isLoading = useSelector(isUsersLoading)
  const user = useSelector((state: UsersAwareState) => getUserById(state, id))

  if (isLoading) {
    return <div>Load user with ID {id} ...</div>
  }

  if (!user) {
    return <Error statusCode={404} />
  }

  return (
    <div>
      <pre>
        <code>{JSON.stringify(user, null, 2)}</code>
      </pre>
    </div>
  )
}

export { User }
