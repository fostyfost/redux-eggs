import { SagaModule } from '../../store/saga-extension/contracts'
import { CountActionsUnion } from './action-creators'
import { COUNT_MODULE_NAME } from './index'
import { countReducer } from './reducer'
import { countWatcher } from './saga'
import { CountAwareState } from './contracts/state'

export const getCountModule = (): SagaModule<CountAwareState, CountActionsUnion> => {
  return {
    id: COUNT_MODULE_NAME,
    reducerMap: {
      [COUNT_MODULE_NAME]: countReducer,
    },
    sagas: [countWatcher],
  }
}
