import { SagaModule } from '../../store/saga-extension/contracts'
import { AviasalesActionsUnion } from './action-creators'
import { AviasalesAwareState } from './contracts/state'
import { AVIASALES_MODULE_NAME } from './index'
import { aviasalesReducer } from './reducer'
import { aviasalesSaga } from './saga'

export const getAviasalesModule = (): SagaModule<AviasalesAwareState, AviasalesActionsUnion> => {
  return {
    id: AVIASALES_MODULE_NAME,
    reducerMap: {
      [AVIASALES_MODULE_NAME]: aviasalesReducer,
    },
    sagas: [aviasalesSaga],
  }
}
