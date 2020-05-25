import { clockReducer } from './reducer'
import { startClockWatcher } from './saga'
import { CLOCK_MODULE_NAME } from './index'
import { ClockActionsUnion } from './action-creators'
import { ISagaModule } from '../../store/saga-extension/contracts'
import { ClockAwareState } from './state'

export const getClockModule = (): ISagaModule<ClockAwareState, ClockActionsUnion> => {
  return {
    id: CLOCK_MODULE_NAME,
    reducerMap: {
      [CLOCK_MODULE_NAME]: clockReducer,
    },
    sagas: [startClockWatcher],
    retained: true,
  }
}
