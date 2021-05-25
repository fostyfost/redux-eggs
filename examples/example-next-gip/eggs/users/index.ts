import type { Egg } from '@redux-eggs/redux'

import { usersReducer } from './reducer'
import { loadUsersWatcher } from './saga'

export const USERS_MODULE_NAME = 'users-egg' as const

export const getUsersEgg = (): Egg => {
  return {
    id: USERS_MODULE_NAME,
    reducerMap: {
      [USERS_MODULE_NAME]: usersReducer,
    },
    sagas: [loadUsersWatcher],
  }
}
