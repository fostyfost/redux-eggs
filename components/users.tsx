import React from 'react'
import { useSelector } from 'react-redux'
import { usersSelector, errorSelector, isUsersLoading } from '../modules/users/selectors'

const Users = () => {
  const isLoading = useSelector(isUsersLoading)
  const users = useSelector(usersSelector)
  const error = useSelector(errorSelector)

  if (isLoading) {
    return <div>Loading ...</div>
  }

  return (
    <div>
      {users && (
        <pre>
          <code>{JSON.stringify(users, null, 2)}</code>
        </pre>
      )}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  )
}

export { Users }
