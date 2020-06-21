import { ISagaModule } from '../../store/saga-extension/contracts'
import { CountActionsUnion } from './action-creators'
import { COUNT_MODULE_NAME } from './index'
import { countReducer } from './reducer'
import { countWatcher } from './saga'
import { CountAwareState } from './state'

export const getCountModule = (): ISagaModule<CountAwareState, CountActionsUnion> => {
  return {
    id: COUNT_MODULE_NAME,
    reducerMap: {
      [COUNT_MODULE_NAME]: countReducer,
    },
    sagas: [countWatcher],
  }
}
