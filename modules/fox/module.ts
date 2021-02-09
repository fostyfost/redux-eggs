import type { SagaModule } from '@/store/saga-extension/contracts'

import type { FoxActionsUnion } from './action-creators'
import type { FoxAwareState } from './contracts/state'
import { FOX_MODULE_NAME } from './index'
import { foxReducer } from './reducer'
import { loadFoxWatcher } from './saga'

export const getFoxModule = (): SagaModule<FoxAwareState, FoxActionsUnion> => {
  return {
    id: FOX_MODULE_NAME,
    reducerMap: {
      [FOX_MODULE_NAME]: foxReducer,
    },
    sagas: [loadFoxWatcher],
  }
}
