import { countReducer } from './reducer'
import { countWatcher } from './saga'
import { COUNT_MODULE_NAME } from './index'
import { ISagaModule } from '../../store/saga-extension/contracts'
import { CountAwareState } from './state'
import { CountActionsUnion } from './action-creators'

export const getCountModule = (): ISagaModule<CountAwareState, CountActionsUnion> => {
  return {
    id: COUNT_MODULE_NAME,
    reducerMap: {
      [COUNT_MODULE_NAME]: countReducer,
    },
    sagas: [countWatcher],
  }
}
