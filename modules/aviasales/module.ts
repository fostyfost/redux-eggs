import { AviasalesActionsUnion } from '@/modules/aviasales/action-creators'
import { AviasalesAwareState } from '@/modules/aviasales/contracts/state'
import { AVIASALES_MODULE_NAME } from '@/modules/aviasales/index'
import { aviasalesReducer } from '@/modules/aviasales/reducer'
import { aviasalesSaga } from '@/modules/aviasales/saga'
import { SagaModule } from '@/store/saga-extension/contracts'

export const getAviasalesModule = (): SagaModule<AviasalesAwareState, AviasalesActionsUnion> => {
  return {
    id: AVIASALES_MODULE_NAME,
    reducerMap: {
      [AVIASALES_MODULE_NAME]: aviasalesReducer,
    },
    sagas: [aviasalesSaga],
  }
}
