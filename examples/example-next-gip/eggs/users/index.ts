import type { Egg } from '@redux-eggs/core'

import { USERS_REDUCER_KEY, usersReducer } from '@/eggs/users/reducer'
import { loadUsersWatcher } from '@/eggs/users/saga'
import type { AppStore } from '@/store'

export const getUsersEgg = (): Egg<AppStore> => {
  return {
    id: 'users',
    reducersMap: {
      [USERS_REDUCER_KEY]: usersReducer,
    },
    sagas: [loadUsersWatcher],
  }
}
