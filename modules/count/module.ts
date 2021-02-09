import type { SagaModule } from '@/store/saga-extension/contracts'

import type { CountActionsUnion } from './action-creators'
import type { CountAwareState } from './contracts/state'
import { COUNT_MODULE_NAME } from './index'
import { countReducer } from './reducer'
import { countWatcher } from './saga'

export const getCountModule = (): SagaModule<CountAwareState, CountActionsUnion> => {
  return {
    id: COUNT_MODULE_NAME,
    reducerMap: {
      [COUNT_MODULE_NAME]: countReducer,
    },
    sagas: [countWatcher],
  }
}
