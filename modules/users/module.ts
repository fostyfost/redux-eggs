import { SagaModule } from '../../store/saga-extension/contracts'
import { UsersActionsUnion } from './action-creators'
import { USERS_MODULE_NAME } from './index'
import { usersReducer } from './reducer'
import { loadUsersWatcher } from './saga'
import { UsersAwareState } from './state'

export const getUsersModule = (): SagaModule<UsersAwareState, UsersActionsUnion> => {
  return {
    id: USERS_MODULE_NAME,
    reducerMap: {
      [USERS_MODULE_NAME]: usersReducer,
    },
    sagas: [loadUsersWatcher],
  }
}
