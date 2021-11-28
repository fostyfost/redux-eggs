import type { Egg } from '@redux-eggs/core'

import { loadUsersWatcher } from '@/eggs/users/saga'
import { USERS_SLICE, usersReducer } from '@/eggs/users/slice'
import type { AppStore } from '@/store'

export const getUsersEgg = (): Egg<AppStore> => {
  return {
    id: 'users',
    reducersMap: {
      [USERS_SLICE]: usersReducer,
    },
    sagas: [loadUsersWatcher],
  }
}
