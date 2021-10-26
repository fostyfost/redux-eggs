import type { Egg } from '@redux-eggs/core'

import { loadUsersWatcher } from '@/eggs/users/saga'
import { USERS_SLICE, usersReducer } from '@/eggs/users/slice'

export const getUsersEgg = (): Egg => {
  return {
    id: 'users',
    reducerMap: {
      [USERS_SLICE]: usersReducer,
    },
    sagas: [loadUsersWatcher],
  }
}
