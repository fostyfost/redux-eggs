import NextLink from 'next/link'
import type { FC } from 'react'
import { useSelector } from 'react-redux'

import { isUsersLoading, usersIdsSelector } from '@/eggs/users/selectors'

interface Props {
  rootUrl: string
}

const LoadedUsers: FC<Props> = ({ rootUrl }) => {
  const ids = useSelector(usersIdsSelector)

  return (
    <div>
      {ids.map(id => (
        <NextLink key={id} href={`${rootUrl}/${id}`} scroll={false}>
          <a style={{ display: 'block', padding: '10px' }}>Get user with ID: {id}</a>
        </NextLink>
      ))}
      <NextLink prefetch={false} href={`${rootUrl}/100500`} scroll={false}>
        <a style={{ display: 'block', padding: '10px' }}>Unavailable user</a>
      </NextLink>
    </div>
  )
}

const UsersIds: FC<Props> = ({ rootUrl }) => {
  const isLoading = useSelector(isUsersLoading)

  return isLoading ? <div>Load users IDs ...</div> : <LoadedUsers rootUrl={rootUrl} />
}

export { UsersIds }
