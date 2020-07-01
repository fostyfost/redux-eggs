import { SagaModule } from '../../store/saga-extension/contracts'
import { ClockActionsUnion } from './action-creators'
import { CLOCK_MODULE_NAME } from './index'
import { clockReducer } from './reducer'
import { startClockWatcher } from './saga'
import { ClockAwareState } from './state'

export const getClockModule = (): SagaModule<ClockAwareState, ClockActionsUnion> => {
  return {
    id: CLOCK_MODULE_NAME,
    reducerMap: {
      [CLOCK_MODULE_NAME]: clockReducer,
    },
    sagas: [startClockWatcher],
    retained: true,
  }
}
