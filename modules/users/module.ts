import type { SagaModule } from '@/store/saga-extension/contracts'

import type { UsersActionsUnion } from './action-creators'
import type { UsersAwareState } from './contracts/state'
import { USERS_MODULE_NAME } from './index'
import { usersReducer } from './reducer'
import { loadUsersWatcher } from './saga'

export const getUsersModule = (): SagaModule<UsersAwareState, UsersActionsUnion> => {
  return {
    id: USERS_MODULE_NAME,
    reducerMap: {
      [USERS_MODULE_NAME]: usersReducer,
    },
    sagas: [loadUsersWatcher],
  }
}
