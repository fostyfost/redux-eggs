import type { Egg } from '@redux-eggs/redux'

import { USERS_REDUCER_KEY, usersReducer } from '@/eggs/users/reducer'
import { loadUsersWatcher } from '@/eggs/users/saga'

export const getUsersEgg = (): Egg => {
  return {
    id: 'users',
    reducerMap: {
      [USERS_REDUCER_KEY]: usersReducer,
    },
    sagas: [loadUsersWatcher],
  }
}
