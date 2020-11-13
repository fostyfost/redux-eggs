import Link from 'next/link'
import { FC } from 'react'
import { useSelector } from 'react-redux'

import { isUsersLoading, usersIdsSelector } from '@/modules/users/selectors'

const UsersIds: FC = () => {
  const isLoading = useSelector(isUsersLoading)
  const ids = useSelector(usersIdsSelector)

  if (isLoading) {
    return <div>Load users IDs ...</div>
  }

  return (
    <div>
      {ids.map(id => (
        <Link key={id} href={'/users-ids/[id]'} as={`/users-ids/${id}`}>
          <a style={{ display: 'block', padding: '10px' }}>Get user with ID: {id}</a>
        </Link>
      ))}
      <Link href={'/users-ids/[id]'} as={'/users-ids/100500'}>
        <a style={{ display: 'block', padding: '10px' }}>Unavailable user</a>
      </Link>
    </div>
  )
}

export { UsersIds }
