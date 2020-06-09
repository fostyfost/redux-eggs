import { usersReducer } from './reducer'
import { USERS_MODULE_NAME } from './index'
import { loadUsersWatcher } from './saga'
import { UsersActionsUnion } from './action-creators'
import { ISagaModule } from '../../store/saga-extension/contracts'
import { UsersAwareState } from './state'

export const getUsersModule = (): ISagaModule<UsersAwareState, UsersActionsUnion> => {
  return {
    id: USERS_MODULE_NAME,
    reducerMap: {
      [USERS_MODULE_NAME]: usersReducer,
    },
    sagas: [loadUsersWatcher],
  }
}
