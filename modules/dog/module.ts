import type { SagaModule } from '@/store/saga-extension/contracts'

import type { DogActionsUnion } from './action-creators'
import { DogPublicAction } from './action-creators'
import type { DogAwareState } from './contracts/state'
import { DOG_MODULE_NAME } from './index'
import { dogReducer } from './reducer'
import { loadDogWatcher } from './saga'

export const getDogModule = (): SagaModule<DogAwareState, DogActionsUnion> => {
  return {
    id: DOG_MODULE_NAME,
    reducerMap: {
      [DOG_MODULE_NAME]: dogReducer,
    },
    initialActions: [DogPublicAction.loadDog()],
    sagas: [loadDogWatcher],
  }
}
